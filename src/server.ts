import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { pathToFileURL } from 'url';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // To get the filename of filtered image
  const path = require('path');

  // To get the file from tmp directory for cleanup
  const fs = require('fs');
  
  app.get("/filteredImage/", async(req:express.Request, res:express.Response) =>{
    const image_url:string = req.query.image_url;
    if(!image_url){
      res.status(403).send("Bad request. Missing query param");
    }
    const filteredImagePath = await filterImageFromURL(image_url);
    let imagesToDelete: string[] = new Array();
    imagesToDelete.push(filteredImagePath);
    res.status(200).sendFile(filteredImagePath);
    res.on('finish',function(){
      deleteLocalFiles(imagesToDelete);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res: express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();