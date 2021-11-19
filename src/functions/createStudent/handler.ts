import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import { v4 } from 'uuid';

import schema from './schema';

const createStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  var id = v4();
  const TableName = 'SEMSTable';
  const body = event.body;
  const params = {
    TableName,
    Item: {
      id,
      ...body
    }
  };
  var msg = await Dynamo.createData(params);
  return formatJSONResponse({
    message: `New Student ${msg}`
  });
}

export const main = middyfy(createStudent);
