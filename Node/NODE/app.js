var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
const mongoose=require('mongoose')
const cors = require('cors');

var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('../Web'));
app.use(cors());

const conect=mongoose.connection
mongoose.connect('mongodb+srv://JohanPasto:123@cluster0.u59wgwp.mongodb.net/base');
conect.once('open',()=>{
    console.log("OK");
})
conect.on('error',(error)=>{
    console.log("PAILAS");
})
const productosSchema=new mongoose.Schema({
    producto:String,
    precio:Number,
    cantidad:Number,
    fecha:Date,
    direccion:String
})
const Productos=mongoose.model('productos', productosSchema)


app.post('/crear', async (req,res)=>{
    try{
        const nuevoP=new Productos({
            producto:req.body.producto,
            cantidad:req.body.cantidad,
            precio:req.body.precio,
            fecha:req.body.fecha,
            direccion:req.body.direccion
        })
await nuevoP.save()
res.status(201).send("Productos guardados")
    }
    catch(error){
console.error(error)
res.status(500).send("Error: " + error.message)
    }
})

app.get("/leer",async (req,res)=>{
    try{
        const productos= await Productos.find()
        res.json(productos)
    }
    catch(error){console.error(error)
res.status(500).send("Error: " + error.message)}
})
app.put('/actualizar/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const productoActualizado= await Productos.findByIdAndUpdate(
            id,
            {
                producto: req.body.producto,
                cantidad: req.body.cantidad,
                precio: req.body.precio,
                direccion: req.body.direccion,
                fecha: req.body.fecha

            },
            {new:true}
        )
        if(!productoActualizado){
            return res.status(404).send("Producto no encontrado")
        }
        else{
            res.status(201).send("Producto actualizado")
        }
    }
     catch(error){
        console.error(error)
        res.status(500).send("Error leer: ",error)
    }
})
app.delete('/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Productos.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).send("Producto no encontrado");
        }
        res.send("Producto eliminado");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error: " + error.message);
    }
});

app.listen(3000,()=>{
    console.log("Servidor ok")
})