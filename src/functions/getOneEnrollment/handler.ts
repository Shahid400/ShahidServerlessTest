import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Dynamo } from '@libs/dynamodb';

const getOneEnrollment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  var { id } = event.pathParameters;
  
  console.log(id);

  const params = {
    TableName: 'SEMSTable',
    Key: {
      id
    }
  }
  try {
    const data = await Dynamo.getOne(params);
  if (data.Item.id===id) {
    const msg = "Enrollment Found";
    var courseid = data.Item.courseid;
    var studentid = data.Item.studentid;
    var dateofenrollment = data.Item.dateofassignment;
    const params1 = {
      TableName: 'SEMSTable',
      Key: {
        id: studentid
      }
    }
    const data1 = await Dynamo.getOne(params1);
    if(data1.Item.id===studentid){
      var studentname = data1.Item.name;
    }
    const params2 = {
      TableName: 'SEMSTable',
      Key: {
        id: courseid
      }
    }
    const data2 = await Dynamo.getOne(params2);
    if(data2.Item.id===courseid){
      var coursetitle = data2.Item.coursetitle;
    }
    const enrollment = {
      coursetitle,
      studentname,
      dateofenrollment
     }
    return formatJSONResponse({
      message: msg, enrollment
    });
  } 
  } catch (error) {
    return formatJSONResponse({
      message: "Enrollment not found"
    });
  }
}

export const main = middyfy(getOneEnrollment);
