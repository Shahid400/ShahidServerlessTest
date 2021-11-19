import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const updateCourse: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const {id} = event.pathParameters;
  const coursecode = event.body.coursecode;
  const coursetitle = event.body.coursetitle;
  const CH = event.body.CH;
  const params = {
    TableName: 'SEMSTable',
    Key: {
      id
    },
    UpdateExpression: "set coursecode = :cc, coursetitle = :ct, CH = :ch",
    ExpressionAttributeValues: {
      ":cc": coursecode,
      ":ct": coursetitle,
      ":ch": CH,
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

export const main = middyfy(updateCourse);
