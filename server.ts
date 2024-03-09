import {
  Client,
  GetPageInfoRequest,
  GetPageMediaRequest,
} from "instagram-graph-api";

const client: Client = new Client(
  "EAAVDGKi9R7ABO9zJo2cSgnFR5xy5D0ZAkIYypKZCFCAN2zZAZBhwRKNzeEwG88aL46536VOTLQ6y3qCabGyZBTJK8SkpF7x9rcqYkKcZCU1lbCSw4G7r1jTnGIqcmZCX1cZBWftnd1p3tOaw0ZBwhq2FZAtIlSQSenR5lbISAprCpvM3PKZAZA3DiCvOn58Y43p33oSLO4kw0vQ241rw1ckn3cYlmRXF58ZApHgiJfHVt",
  "1481148072806320"
);

const pageInfoRequest: GetPageInfoRequest = client.newGetPageInfoRequest();
const pageMediaRequest: GetPageMediaRequest = client.newGetPageMediaRequest();

console.log(pageInfoRequest);
