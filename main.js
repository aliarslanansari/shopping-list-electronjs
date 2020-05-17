const electron = require("electron");
const url = require("url");
const path = require("path");
const {app,BrowserWindow,Menu,ipcMain} = electron;

let mainWindow;
let addWindow;

//Set Environment
process.env.NODE_ENV = 'production';

//listen for app to be ready

app.on('ready',function(){
    // create new window
    mainWindow = new BrowserWindow({
        frame:false,
        webPreferences: {
            nodeIntegration: true
        }});
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
    // Menu.setApplicationMenu(null);
    // mainWindow.setMenu(mainMenu)
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        frame:false,
        title:"Add Items",
        webPreferences: {
            nodeIntegration: true
        },
        parent:mainWindow,
       
    });
    addWindow.setAlwaysOnTop(true);
    // addWindow.setApplicationMenu(mainMenu);
    // load html into window
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname,"addWindow.html"),
        protocol:"file",
        slashes:true
    }));
    
}
//Catch item:add
ipcMain.on('item:add',function(e,item){
    console.log(item)
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
});

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
            label: 'Clear Item',
            click(){
                mainWindow.webContents.send('item:clear');
            }
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

//if mac, add empty object to menu
if(process.platform === "darwin"){
    mainMenuTemplate.unshift({});
}

//add developer tools item if not in production
if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I':'Ctrl+I',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}

