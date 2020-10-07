/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStudent = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      code
      parentEmail
      location
      name
      gender
      district
      school
      grade
      haveDentalInsurance
      okToReceiveMedicaidInfo
      nonsmilingface
      frontTeeth
      leftimage
      rightimage
      topimage
      bottomimage
      untreatedDecay
      treatedDecay
      sealantsPresent
      treatmentRecommendationCode
      evalcomments
      virtualScreeningExperience
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
        parentEmail
        location
        name
        gender
        district
        school
        grade
        haveDentalInsurance
        okToReceiveMedicaidInfo
        nonsmilingface
        frontTeeth
        leftimage
        rightimage
        topimage
        bottomimage
        untreatedDecay
        treatedDecay
        sealantsPresent
        treatmentRecommendationCode
        evalcomments
        virtualScreeningExperience
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
