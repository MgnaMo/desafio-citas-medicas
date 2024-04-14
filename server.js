import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import express from 'express';
import _ from 'lodash';
import chalk from 'chalk';
import exphbs from 'express-handlebars';
import handlebars from 'handlebars';

const app = express();
const port = 3000;

handlebars.registerHelper('index', function(index) {
    return index + 1;
});

app.engine('.hbs', exphbs.engine ({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.get('/pacientes', async (req, res) => {
    try {
        const respuesta = await axios.get("https://randomuser.me/api/?results=34");
        const usuarios = respuesta.data.results.map(usuario => ({
            Nombre: usuario.name.first,
            Apellido: usuario.name.last,
            Sexo: usuario.gender,
            ID: uuidv4(), //.substring(0, 6), < Para generar un ID de 6 caracteres.
            Timestamp: moment().format('YYYY-MM-DD HH:mm:ss A')
        }));

        const usuariosPorSexo = _.groupBy(usuarios, 'Sexo');
        const hombres = usuariosPorSexo.male || [];
        const mujeres = usuariosPorSexo.female || [];

        console.log(chalk.white.bgBlue('Lista de Usuarios en la Consola:'));
        console.log(chalk.white.bgBlue(JSON.stringify(usuarios, null, 2)));

        res.render('usuarios', { Hombres: hombres, Mujeres: mujeres });
    } catch (error) {
        console.error(chalk.red('Error al obtener usuarios:', error));
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error });
    }
});

app.listen(port, () => {
    console.log(`El servidor está inicializado en el puerto ${port}`);
});