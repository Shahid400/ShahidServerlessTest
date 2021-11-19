import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Dynamo } from '@libs/dynamodb';

const getOneStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: 'SEMSTable',
    KeyConditionExpression: 'id = :id',
    ProjectionExpression: '#n, #e, #a, #d',
    ExpressionAttributeNames: {
      '#n': 'name',
      '#e': 'email',
      '#a': 'age',
      '#d': 'dob'
    },
    ExpressionAttributeValues: {
      ':id': id
    }
  }
  const data = await Dynamo.getData(params);
  const student = data.Items;
  if (data.Count === 1) {
    const msg = "Student Found";
    return formatJSONResponse({
      message: msg, student
    });
  } else {
    return formatJSONResponse({
      message: "Wrong ID"
    });
  }
}

export const main = middyfy(getOneStudent);
