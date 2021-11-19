import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const getStudentsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const params = {
    TableName: 'SEMSTable'
  }
  try {
    const data = await Dynamo.getList(params);
    const students = [{}];
    data.Items.map(e => {
      if(e.name !== undefined) {
        const name = e.name;
        const email = e.email;
        const age = e.age;
        const dob = e.dob;

        students.push(
          {
            name,
            email,
            age,
            dob
          }
        );
      }
    });

      return formatJSONResponse({
        message: "List of the students", students
      });
    // }
  } catch (error) {
    return formatJSONResponse({
      message: "Data not found in DB"
    });
  }
}

export const main = middyfy(getStudentsList);
