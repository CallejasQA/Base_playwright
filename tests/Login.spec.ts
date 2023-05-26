import { test, expect, chromium, Page } from '@playwright/test';
import { PTS } from '../pageObjects/Model';
import dotenv from 'dotenv';
import { Common } from '../common/commo';

dotenv.config()

//valiables Globales
let tg:number=300;
let f:any=0;
let page:Page;
let browser:any;
let context:any;



let common = new Common();
let date: Date = new Date();

test.describe('Escenarios Login TVT', () => {
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

test.beforeAll(async () => {
  console.log('Iniciando pruebas...');
  browser=await chromium.launch({});
  context=await browser.newContext({
    recordVideo:{
      dir:process.env.ruta_video 
    } 
  });
  page=await context.newPage();
  
  f = new PTS(page);
  console.log(await page.video());
  await f.OpenUrl(process.env.url + "/web/index.php/auth/login");
  await f.Validar_Titulo("OrangeHRM")
  await f.Validar_Url(process.env.url + "/web/index.php/auth/login")
});

//para utlizar los datos de diretorio data archivo de Excel
const xlsx = require("xlsx");
const libro = xlsx.readFile(process.env.readFile_Login);
const hoja = libro.SheetNames[0];
const data = xlsx.utils.sheet_to_json(libro.Sheets[hoja]);
console.log(data);




test('Verificar login usuario y contraseña inavido', async () => {
  for(const fila of data){
  await f.Escribir_Texto(fila['ID_usuario'], fila['INP_usuario_invalido'],tg)
  await f.Escribir_Texto(fila['ID_contra'], fila['INP_contra_invalida'],tg)
  await f.Click_Boton('Login',tg)
  await sleep(1000);
  await f.Validar_Texto("//p[contains(.,'Invalid credentials')]", "Invalid credentials",tg)
}
})
test('Verificar login Contraseña inavlida', async () => {
  for(const fila of data){
  await f.Escribir_Texto(fila['ID_usuario'], process.env.usuario,tg)
  await f.Escribir_Texto(fila['ID_contra'], fila['INP_contra_invalida'],tg)
  await f.Click_Boton('Login',tg)
  await sleep(1000);
  await f.Validar_Texto("//p[contains(.,'Invalid credentials')]", "Invalid credentials",tg)
  }
})

test('Verificar login exitoso', async () => {
  for(const fila of data){
  await f.Escribir_Texto(fila['ID_usuario'], process.env.usuario,tg)
  await f.Escribir_Texto(fila['ID_contra'], process.env.contra,tg)
  await f.Click_Boton('Login',tg)
  await sleep(1000);
  //await f.Validar_Texto("//i[contains(.,'Dashboard')]", "Dashboard",tg)
  await f.Screenshot(process.env.ruta_screen + 'screenshot'+ " " + date.getFullYear()+ " "+ "D" + date.getDate()+ " "+ "H" + date.getHours()+ " "+ "m" + date.getMinutes()+ '.png', tg)
  await f.Refrescar_Pagina(tg)
  
  //Utilizar metodos del directorio common
  await console.log(common.GenararNombres('NC'));
  await console.log(common.RandomCelular());
  
  

  }
})

test.afterAll(async()=>{
  console.log("Termina la prueba");
  await page.close();
  await context.close();
  await browser.close();
})
});
