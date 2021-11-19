import type { AWS } from '@serverless/typescript';

import createStudent from '@functions/createStudent';
import createCourse from '@functions/createCourse';
import createEnrollment from '@functions/createEnrollment';
import getOneStudent from '@functions/getOneStudent';
import getOneCourse from '@functions/getOneCourse';
import getOneEnrollment from '@functions/getOneEnrollment';
import deleteStudent from '@functions/deleteStudent';
import deleteCourse from '@functions/deleteCourse';
import deleteEnrollment from '@functions/deleteEnrollment';
import updateStudent from '@functions/updateStudent';
import updateCourse from '@functions/updateCourse';
import updateEnrollment from '@functions/updateEnrollment';
import getStudentsList from '@functions/getStudentsList';
import getCoursesList from '@functions/getCoursesList';
import getEnrollmentsList from '@functions/getEnrollmentsList';

const serverlessConfiguration: AWS = {
  service: 'shahidserverlesstask',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline'
  ],
  custom: {
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        migrate: true,
        seed: true
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-2',
    iamRoleStatements:
    [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DB_TABLE}'
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DB_TABLE: 'SEMSTable'
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources:{
      CRUDByShahidTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
           TableName: "SEMSTable",
           BillingMode: "PAY_PER_REQUEST",
           AttributeDefinitions: [
             { AttributeName: 'id', AttributeType: 'S' }
           ],
           KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH'}
           ],
        },
      }
    }
  },
  // import the function via paths
  functions: { createStudent, createCourse, createEnrollment, getOneStudent, getOneCourse, getOneEnrollment, deleteStudent, deleteCourse, deleteEnrollment, updateStudent, updateCourse, updateEnrollment, getStudentsList, getCoursesList, getEnrollmentsList }
  
};

module.exports = serverlessConfiguration;
