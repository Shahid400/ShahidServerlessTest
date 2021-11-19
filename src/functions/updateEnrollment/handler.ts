import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const updateEnrollment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const {id} = event.pathParameters;
  const courseid = event.body.courseid;
  const studentid = event.body.studentid;
  const dateofassigment = event.body.dateofassigment;
  const params = {
    TableName: 'SEMSTable',
    Key: {
      id
    },
    UpdateExpression: "set courseid = :ci, studentid = :si, dateofassigment = :doa",
    ExpressionAttributeValues: {
      ":ci": courseid,
      ":si": studentid  ,
      ":doa": dateofassigment,
    },
  }
  const params1 = {
    TableName: 'SEMSTable',
    Key: {
      id
    }
  }
  try {
    const data = await Dynamo.getOne(params1);
    if(data.Item.id===id){
      const msg = await Dynamo.updateOne(params);
      return formatJSONResponse({
        message: `Course ${msg}`
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Course not found"
    });
  }
}

export const main = middyfy(updateEnrollment);
