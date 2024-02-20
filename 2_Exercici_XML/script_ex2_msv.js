document.addEventListener("DOMContentLoaded", carregarArxius_f);
let cotxes;
let catalog;

function carregarArxius_f()
{
    if (window.XMLHttpRequest)
    {
		cotxes  = new XMLHttpRequest();
        catalog = new XMLHttpRequest();
	}
    else if (window.ActiveXObject)
    {
		cotxes  = new ActiveXObject("Microsoft.XMLHTTP");
        catalog = new ActiveXObject("Microsoft.XMLHTTP")
    }

    cotxes.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            tractarCotxes_f(this);
        }
    };
    cotxes.open("GET", './cotxes.xml');
    cotxes.send();

    catalog.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            tractarCatalog_f(this);
        }
    };
    catalog.open("GET", "./cd_Catalog.xml");
    catalog.send();
}

function tractarCotxes_f(xml)
{
    let xmlDoc = xml.responseXML;
    let automovils = xmlDoc.getElementsByTagName("automovil");
    let select = document.getElementById("llista");

    let marcas = [];

    for (let i = 0; i < automovils.length; i++)
    {
        let marca = automovils[i].getElementsByTagName("marca")[0].textContent;
        if (!marcas.includes(marca))
        {
            marcas.push(marca);
        }
    }

    marcas.forEach(function(marca)
    {
        let option = document.createElement("option");
        option.text = marca;
        select.add(option);
    });

    select.addEventListener("change", function(event)
    {
        let marcaSeleccionada = event.target.value;
        mostrarDetalls_f(marcaSeleccionada, automovils);
    });

    let primeraMarca = automovils[0].getElementsByTagName("marca")[0].textContent;
    // console.log(primeraMarca);
    mostrarDetalls_f(primeraMarca, automovils);
}

function mostrarDetalls_f(marcaSeleccionada, automovils)
{
    let p = document.getElementById("resultatsEx1");
    let marcaEnsenyada = false;

    for (let i = 0; i < automovils.length; i++)
    {
        let marca = automovils[i].getElementsByTagName("marca")[0].textContent;
        let model = automovils[i].getElementsByTagName("model")[0].textContent;
        let color = automovils[i].getElementsByTagName("color")[0].textContent;
        let motor = automovils[i].getElementsByTagName("motor")[0].textContent;

        if (marca === marcaSeleccionada)
        {
            if (!marcaEnsenyada)
            {
                let h2 = document.createElement("h2");
                h2.textContent = marca;
                p.appendChild(h2);
                marcaEnsenyada = true;
            }

            let dl = document.createElement("dl");
            let dt = document.createElement("dt");
            dt.textContent = model;
            let dd = document.createElement("dd");
            dd.textContent = "Color: " + color + ", Motor: " + motor;
            dl.appendChild(dt);
            dl.appendChild(dd);
            p.appendChild(dl);
        }
    }
}

function tractarCatalog_f(xml)
{
    let xmlDoc = xml.responseXML;
    let artistes = [];

    let artistes_xml = xmlDoc.getElementsByTagName("ARTIST");

    for (let i = 0; i < artistes_xml.length; i++)
    {
        let artista = artistes_xml[i].textContent;
        if (!artistes.includes(artista))
        {
            artistes.push(artista);
        }
    }
    artistes.sort();

    let ol = document.createElement("ol");
    artistes.forEach(function(artista)
    {
        let li = document.createElement("li");
        li.textContent = artista;
        li.style.cursor = "pointer";
        li.addEventListener("dblclick", function()
        {
            detallsArtista_f(artista, xmlDoc);
        });
        ol.appendChild(li);
    });

    let resultatsEx2 = document.getElementById("resultatsEx2");
    resultatsEx2.appendChild(ol);
}

function detallsArtista_f(artista, xmlDoc)
{
    let llista = document.getElementById("resultatsEx2");

    let cd_artista = []; //Array per guardar les dades dels CD's de l'artista
    let artistes_xml = xmlDoc.getElementsByTagName("ARTIST");

    for (let i = 0; i < artistes_xml.length; i++)
    {
        let nom_artista = artistes_xml[i].textContent;
        if (nom_artista === artista)
        {
            cd_artista.push(artistes_xml[i].parentNode);
            console.log(artistes_xml[i].parentNode);
        }
    }

    let table = document.createElement("table");
    table.style.border = "1px solid black";

    let capsalera = document.createElement("tr");

    let cela_art = document.createElement("th");
    cela_art.textContent = "Artista";
    capsalera.appendChild(cela_art);

    let titol = document.createElement("th");
    titol.textContent = "Titol";
    capsalera.appendChild(titol);

    let any = document.createElement("th");
    any.textContent = "Any";
    capsalera.appendChild(any);

    let emp = document.createElement("th");
    emp.textContent = "Empresa";
    capsalera.appendChild(emp);

    let preu = document.createElement("th");
    preu.textContent = "Preu";
    capsalera.appendChild(preu);

    table.appendChild(capsalera);

    // Per cada cd de l'artista:
    cd_artista.forEach(function(entrada)
    {
        let fila = document.createElement("tr");

        let cela_art = document.createElement("td");
        cela_art.textContent = artista;
        fila.appendChild(cela_art);

        let celdaTítulo = document.createElement("td");
        celdaTítulo.textContent = entrada.querySelector("TITLE").textContent;
        fila.appendChild(celdaTítulo);

        let any = document.createElement("td");
        any.textContent = entrada.querySelector("YEAR").textContent;
        fila.appendChild(any);

        let emp = document.createElement("td");
        emp.textContent = entrada.querySelector("COMPANY").textContent;
        fila.appendChild(emp);

        let preu = document.createElement("td");
        preu.textContent = entrada.querySelector("PRICE").textContent;
        fila.appendChild(preu);

        table.appendChild(fila);
    });

    let ths = table.getElementsByTagName("th");
    for (let i = 0; i < ths.length; i++) {
        ths[i].style.border = "1px solid black";
    }

    let tds = table.getElementsByTagName("td");
    for (let i = 0; i < tds.length; i++) {
        tds[i].style.border = "1px solid black";
    }

    llista.innerHTML = "";
    llista.appendChild(table);
}