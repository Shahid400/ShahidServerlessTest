import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const getCoursesList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const params = {
    TableName: 'SEMSTable'
  }
  try {
    const data = await Dynamo.getList(params);
    const courses = [{}];
    data.Items.map(e => {
      if(e.coursetitle !== undefined) {
        const courseid = e.id;
        const coursename = e.coursetitle;
        const coursech = e.dateofassigment;

        courses.push(
          {
            courseid,
            coursename,
            coursech
          }
        );
      }
    });

      return formatJSONResponse({
        message: "List of the courses", courses
      });
  } catch (error) {
    return formatJSONResponse({
      message: "Data not found in DB"
    });
  }
}

export const main = middyfy(getCoursesList);
