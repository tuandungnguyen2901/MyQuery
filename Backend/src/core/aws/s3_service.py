import logging.config

import boto3
from botocore.exceptions import ClientError

from src.core.setting import settings


logger = logging.getLogger(__name__)


class S3Events(object):

    def __init__(self) -> None:
        self.aws_access_key_id = settings.AWS_ACCESS_KEY_ID
        self.aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY
        self.bucket = settings.S3_BUCKET
        self.region_name = settings.AWS_REGION
        if settings.STAGE != "local":
            self.client = boto3.client('s3')
        else:
            self.client = boto3.client(
                's3',
                region_name=self.region_name,
                aws_access_key_id=self.aws_access_key_id,
                aws_secret_access_key=self.aws_secret_access_key,
            )

    def upload_fileobj(self, file_obj=None, key: str = None) -> bool:  # type: ignore
        # If S3 object_name was not specified, use file_name
        if key is None or self.bucket is None:
            logger.info("Key and bucket cannot be None")
            return False
        # Upload the file
        try:
            self.client.upload_fileobj(file_obj.file,
                                       self.bucket,
                                       key,
                                       ExtraArgs={"ACL": "public-read",
                                                  "ContentType": file_obj.content_type})
        except ClientError as e:
            logger.error(f"Failed to upload image {e}")
            return False

        logger.info("File object uploaded to https://s3.amazonaws.com/{}/{}".format(self.bucket, key))
        return True

    def delete_fileobj(self, key: str = None) -> bool:
        if key is None or self.bucket is None:
            logger.info("key and bucket cannot be None")
            return False
        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
        except ClientError as e:
            logger.error(e)
            return False

        return True
