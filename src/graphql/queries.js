/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStudent = /* GraphQL */ `
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      code
      firstname3letters
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
      cannotEvaluate
      evalcomments
      evalStatus
      virtualScreeningExperience
      optout
      dentalPain
      screener
      optoutReason
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
        firstname3letters
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
        cannotEvaluate
        evalcomments
        evalStatus
        virtualScreeningExperience
        optout
        dentalPain
        screener
        optoutReason
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSchool = /* GraphQL */ `
  query GetSchool($id: ID!) {
    getSchool(id: $id) {
      id
      name
      district
      createdAt
      updatedAt
    }
  }
`;
export const listSchools = /* GraphQL */ `
  query ListSchools(
    $filter: ModelSchoolFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSchools(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        district
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
