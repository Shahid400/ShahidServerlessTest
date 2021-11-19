import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Dynamo } from '@libs/dynamodb';

const getOneCourse: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: 'SEMSTable',
    KeyConditionExpression: 'id = :id',
    ProjectionExpression: 'id, coursetitle, CH',
    ExpressionAttributeValues: {
      ':id': id
    }
  }
  const data = await Dynamo.getData(params);
  const course = data.Items
  if (data.Count === 1) {
    const msg = "Course Found";
    return formatJSONResponse({
      message: msg, course
    });
  } else {
    return formatJSONResponse({
      message: "Wrong ID"
    });
  }
}

export const main = middyfy(getOneCourse);
