const express = require('express')
const https = require('https');
const fs = require('fs');
const N3 = require('n3');
const rdf = require('rdflib');

var SparqlParser = require('sparqljs').Parser;

const port = 5000;
const url = 'https://waterkwaliteit-brugge-ldes.kindflower-25e41809.westeurope.azurecontainerapps.io/Waterkwaliteit/latestView?pageNumber=1';

const app = express();

const regexIsoDatetime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const regexBasicDate = /^\d{8}$/;

write_stream = fs.createWriteStream("output.txt",{flags:'a'});

parser =  new N3.StreamParser();
rdfStream_file = fs.createReadStream('output.txt');

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

const store = rdf.graph();
const mimeType = 'text/turtle';









const query = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX time: <http://www.w3.org/2006/time#>
PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?observedProperty ?phenomenonTime ?resultValue ?resultUnit
WHERE {
    <https://brugge.be/id/observatie/2016000156/4> 
        rdf:type <http://def.isotc211.org/iso19156/2011/Observation#OM_Observation> ;
        <http://def.isotc211.org/iso19156/2011/Observation#OM_Observation.observedProperty> ?observedProperty ;
        <http://def.isotc211.org/iso19156/2011/Observation#OM_Observation.phenomenonTime> ?phenomenonTimeNode ;
        <http://def.isotc211.org/iso19156/2011/Observation#OM_Observation.result> ?resultNode .
        
    ?phenomenonTimeNode time:inXSDDateTime ?phenomenonTime .

    ?resultNode <http://def.isotc211.org/iso19103/2005/UnitsOfMeasure#Measure.value> ?valueNode .
    ?valueNode <https://schema.org/value> ?resultValue ;
               <https://schema.org/unitCode> ?resultUnit .
}
`;




