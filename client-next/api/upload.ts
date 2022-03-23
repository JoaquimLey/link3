import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable();
  return form.parse(req, async function (err, fields, files) {
    console.log(files.file);
    return res.status(201).send("");
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
