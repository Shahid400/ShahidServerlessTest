import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const getEnrollmentsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const params = {
    TableName: 'SEMSTable'
  }
  try {
    const data = await Dynamo.getList(params);
    var enrollments = [{}];
    data.Items.map(async e => {
      if(e.courseid !== undefined) {
        var courseid = e.courseid;
        var studentid = e.studentid;
        var date_of_enrollment = e.dateofassigment;
        var params1 = {
          TableName: 'SEMSTable',
          Key: {
            id: studentid
          }
        }
        const data1 = await Dynamo.getOne(params1);
        if(data1.Item.id===studentid){
          var studentname = data1.Item.name;
        }
        var params2 = {
          TableName: 'SEMSTable',
          Key: {
            id: courseid
          }
        }
        var data2 = await Dynamo.getOne(params2);
        if(data2.Item.id === courseid){
          var coursetitle = data2.Item.coursetitle;
        }

        enrollments.push(
          {
            coursetitle,
            studentname,
            date_of_enrollment
          }
        );
      }
    });

      return formatJSONResponse({
        message: "List of the enrollments", enrollments
      });
  } catch (error) {
    return formatJSONResponse({
      message: "Data not found in DB"
    });
  }
}

export const main = middyfy(getEnrollmentsList);
