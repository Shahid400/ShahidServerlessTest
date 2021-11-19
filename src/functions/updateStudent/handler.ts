import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const updateStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const {id} = event.pathParameters;
  const name = event.body.name;
  const email = event.body.email;
  const age = event.body.age;
  const dob = event.body.dob;
  const params = {
    TableName: 'SEMSTable',
    Key: {
      id
    },
    UpdateExpression: "set #n = :n, #e = :e, #a = :a, #d = :d",
    ExpressionAttributeNames: {
      '#n': 'name',
      '#e': 'email',
      '#a': 'age',
      '#d': 'dob'
    },
    ExpressionAttributeValues: {
      ":n": name,
      ":e": email,
      ":a": age,
      ":d": dob,
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
        message: `Student ${msg}`
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Student not found"
    });
  }
}

export const main = middyfy(updateStudent);
