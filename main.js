const electron = require("electron");
const url = require("url");
const path = require("path");
const {app,BrowserWindow,Menu} = electron;

let mainWindow;
let addWindow;

//listen for app to be ready

app.on('ready',function(){
    // create new window
    mainWindow = new BrowserWindow();
    // load html into window
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,"mainWindow.html"),
        protocol:"file",
        slashes:true
    }));
    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    })

    //Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:"Add Items"
    });
    // load html into window
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname,"addWindow.html"),
        protocol:"file",
        slashes:true
    }));
}

const mainMenuTemplate = [{
    label:'File',
    submenu:[
        {
            label: 'Add Item',
            click(){
                createAddWindow()
            }
        },
        {
            label: 'Clear Item'
        },
        {   
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q':'Ctrl+Q',
            click(){
                app.quit();
            }
        },
    ]
}];