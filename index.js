const express = require('express')
const https = require('https');
const fs = require('fs');
const N3 = require('n3');

var SparqlParser = require('sparqljs').Parser;

const port = 5000;
const url = 'https://waterkwaliteit-brugge-ldes.kindflower-25e41809.westeurope.azurecontainerapps.io/Waterkwaliteit/latestView?pageNumber=1';

const app = express();

const regexIsoDatetime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const regexBasicDate = /^\d{8}$/;

write_stream = fs.createWriteStream("output.txt",{flags:'a'});

parser =  new N3.StreamParser();
//rdfStream = fs.createReadStream('waterdata.ttl');

https.get(url,(Response)=>{

    Response.pipe(parser);
    //console.log(Response.body);

    Response.on("data", function(chunk) {
        console.log("BODY: " + chunk);
        write_stream.write(chunk+"\n");
      });
    
});

//write_stream.end();


record_count=0;

parser.on('data',(quad)=>{
    record_count++;
    //console.log(`object: ${quad.object.value}`);
    //console.log(quad);
    if(quad.object.value.match(regexIsoDatetime)){
        //console.log(`object: ${quad.object.value}`);
    }

    
    /*
    fs.writeFile('output.txt',quad.toString(),(err)=>{
        if (err) throw err;
       });
        */
});



parser.on('end',()=>{

    console.log(`total number of records: ${record_count}`);
});

parser.on('error',(err)=>{
    console.error(`${err.message}`);
});

//rdfStream.pipe(parser);

/*
rdfStream.on('error', (err) => {
    console.error(`Error reading the file: ${err.message}`);
  });

*/


