/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStudent = /* GraphQL */ `
  mutation CreateStudent(
    $input: CreateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    createStudent(input: $input, condition: $condition) {
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
      evalcomments
      evalStatus
      virtualScreeningExperience
      createdAt
      updatedAt
    }
  }
`;
export const updateStudent = /* GraphQL */ `
  mutation UpdateStudent(
    $input: UpdateStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    updateStudent(input: $input, condition: $condition) {
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
      evalcomments
      evalStatus
      virtualScreeningExperience
      createdAt
      updatedAt
    }
  }
`;
export const deleteStudent = /* GraphQL */ `
  mutation DeleteStudent(
    $input: DeleteStudentInput!
    $condition: ModelStudentConditionInput
  ) {
    deleteStudent(input: $input, condition: $condition) {
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
      evalcomments
      evalStatus
      virtualScreeningExperience
      createdAt
      updatedAt
    }
  }
`;
export const createSchool = /* GraphQL */ `
  mutation CreateSchool(
    $input: CreateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    createSchool(input: $input, condition: $condition) {
      id
      name
      district
      createdAt
      updatedAt
    }
  }
`;
export const updateSchool = /* GraphQL */ `
  mutation UpdateSchool(
    $input: UpdateSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    updateSchool(input: $input, condition: $condition) {
      id
      name
      district
      createdAt
      updatedAt
    }
  }
`;
export const deleteSchool = /* GraphQL */ `
  mutation DeleteSchool(
    $input: DeleteSchoolInput!
    $condition: ModelSchoolConditionInput
  ) {
    deleteSchool(input: $input, condition: $condition) {
      id
      name
      district
      createdAt
      updatedAt
    }
  }
`;
