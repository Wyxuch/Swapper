const remote = require('electron').remote
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const splice = require('buffer-splice')
let win = remote.getCurrentWindow()
let extension
let pathInput

$('.exitButton').on('click',() => {win.close()})

$('.minimizeButton').on('click',() => {win.minimize()})

$('.saveButton').on('click', () => {
    let result = confirm("Do you really want to make changes?");
    if(result){
        modifyFiles()
    }
})

$('.extensionInput').on('change', () => {
    extension = $('.extensionInput').val()
    if (pathInput != undefined){
        findFiles()
    }
})

$('#choosePath').on('change',(e) => {
    pathInput = document.getElementById("choosePath").files[0].path
    if (extension != undefined){
        findFiles()
    }
})

function findFiles(){
    glob(pathInput + '/**/*'+ extension, {}, (err, files)=>{
        drawPaths(files)
      })      
}
function modifyFiles(){
    glob(pathInput + '/**/*'+ extension, {}, (err, files)=>{
        if (files.length){
            for(let i = 0;  i < files.length; i++){
                convertFiles(files[i])
            }
        }
      })      
}

function drawPaths(files){
    const box = $('.files')

    box.empty()

    if (files.length){
        for(let i = 0;  i < files.length; i++){
            box.append('<p><strong>'+i+': </strong>'+ files[i] +'</p>')
        }
    }else{
        box.append('<p><strong>No matches :( </strong></p>')
    }   

}

function convertFiles(filePath){
    fs.readFile(filePath, function (err, data) {
        if (!err){
            getInput(data, filePath)
        }else{
            console.log(err)
        }
    });
}

function getInput(data, filePath){
    const sequenceToChangeFrom = $('.binaryPrevious').val().replace(/\s/g, '')
    const sequenceToChangeTo = $('.binaryChanged').val().replace(/\s/g, '')

    const fromSequence = changeToUint8(sequenceToChangeFrom)
    const toSequence = changeToUint8(sequenceToChangeTo)

    findSequence(data, fromSequence, toSequence, filePath)
}

function findSequence(initialData, fromSequence, toSequence, filePath){
    let convertedFile =  initialData
    for(let i = 0; i < convertedFile.length; i++){
        if (fromSequence[0] == convertedFile[i]){
            for(let j = 0; j < fromSequence.length; j++){
                if (fromSequence[j] == convertedFile[i+j]){
                    if ((j + 1) == fromSequence.length && fromSequence[j] == convertedFile[i+j]){
                        convertedFile = foundFullSequence(convertedFile, fromSequence, toSequence, i, filePath)
                    }
                }
                else{
                    break
                }
            }
        }
    }
    fs.writeFile(filePath, convertedFile, (err) =>{
        if(err){console.log(err)}
    })
}

function foundFullSequence(initialData, fromSequence, toSequence, i, filePath){
    const start = i
    const compareLengths = fromSequence.length - toSequence.length //number of elements comparison 
        if((compareLengths)){ //check if number of elements has changed
            if(compareLengths > 0){ //more elements
                i - compareLengths;
                return splice(initialData, start, (toSequence.length + compareLengths), new Buffer(toSequence))
            }else{ //less elements
                i + compareLengths
                return splice(initialData, start, (toSequence.length - compareLengths), new Buffer(toSequence))
            }
        }else{ //same number of elements
            return splice(initialData, start, toSequence.length, new Buffer(toSequence))
    }
}

function changeToUint8 (string){
    return Uint8Array.from(Buffer.from(string, 'hex'))
}