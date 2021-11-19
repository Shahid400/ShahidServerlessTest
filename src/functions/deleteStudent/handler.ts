import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const deleteStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: 'SEMSTable',
    Key: {
      id
    }
  }
  try {
    const data = await Dynamo.getOne(params);
    if(data.Item.id === id){
      const msg = await Dynamo.deleteOne(params);
      return formatJSONResponse({
        message: `Student ${msg}`
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "student not found"
    });
  }
}

export const main = middyfy(deleteStudent);
