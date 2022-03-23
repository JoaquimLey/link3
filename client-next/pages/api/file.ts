import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { create } from 'ipfs-http-client'

const projectId = "26n6LsvlD9avdpz0EZi57oiMWEO"
const projectSecret = "da82a6018f98257186f335a1ca9a923b"

const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

async function uploadToIPFS(file: File) {
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
  return await client.add(file)
}

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable();
  return form.parse(req, async function (err, fields, files) {
    console.log("err", err);
    console.log("fields", fields);
    console.log("file", files);
    if (files && files.file) {
      console.log(files.file[0])
      await uploadToIPFS(files.file[0])
    }
    return res.status(201).send(files);
  });
};



const upload = ""

export default (req: NextApiRequest, res: NextApiResponse) => {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
      ? console.log("PUT")
      : req.method === "DELETE"
        ? console.log("DELETE")
        : req.method === "GET"
          ? console.log("GET")
          : res.status(404).send("");
};
