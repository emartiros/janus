import AWS from "aws-sdk";

export var iam = new AWS.IAM();
export var kinesisVideo = new AWS.KinesisVideo();
export var sts = new AWS.STS();

export const updateTokens = (accessKey, secretKey) => {
  AWS.config.update({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: "ap-southeast-1",
  });
  iam = new AWS.IAM();
  kinesisVideo = new AWS.KinesisVideo();
  sts = new AWS.STS();
};
