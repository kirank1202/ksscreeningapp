/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStudent = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      code
      name
      gender
      district
      school
      grade
      leftimage
      rightimage
      topimage
      bottomimage
      evaluation
      evalcomments
      createdAt
      updatedAt
    }
  }
`;
export const listStudents = /* GraphQL */ `
  query ListStudents(
    $filter: ModelStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        code
        name
        gender
        district
        school
        grade
        leftimage
        rightimage
        topimage
        bottomimage
        evaluation
        evalcomments
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
