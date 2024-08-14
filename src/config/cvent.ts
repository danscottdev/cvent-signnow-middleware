export interface LoginResult {
  attributes: {
    LoginSuccess: string;
    ServerUrl: string;
    CventSessionHeader: string;
    ErrorMessage: string;
  }
}

export interface SearchResult {
  Id: string[];
}

export interface SearchFilter {
  field: string;
  operator: string;
  filter: string;
}

export interface Contact {
  attributes: {
    'xsi:type': string;
    Id: string;
    SourceId: string;
    FirstName: string;
    LastName: string;
    EmailAddress: string;
    CCEmailAddress: string;
    Company: string;
    Title: string;
    ContactType: string;
    ContactTypeCode: string;
    Salutation: string;
    Nickname: string;
    MiddleName: string;
    Designation: string;
    ExcludedFromEmail: string;
    LastOptOutBy: string;
    CreatedDate: string;
    CreatedBy: string;
    LastModifiedDate: string;
    LastModifiedBy: string;
    EmailAddressStatus: string;
    LogReason: string;
    LogResponse: string;
    PrimaryAddressType: string;
    HomeAddress1: string;
    HomeAddress2: string;
    HomeAddress3: string;
    HomeCity: string;
    HomeState: string;
    HomeStateCode: string;
    HomePostalCode: string;
    HomeCountry: string;
    HomeCountryCode: string;
    HomePhone: string;
    HomeFax: string;
    WorkAddress1: string;
    WorkAddress2: string;
    WorkAddress3: string;
    WorkCity: string;
    WorkState: string;
    WorkStateCode: string;
    WorkPostalCode: string;
    WorkCountry: string;
    WorkCountryCode: string;
    WorkPhone: string;
    WorkFax: string;
    MobilePhone: string;
    Pager: string;
    SMTPCode: string;
    FacebookURL: string;
    TwitterURL: string;
    LinkedInURL: string;
    Gender: string;
    SocialSecurityNumber: string;
    NationalIdentificationNumber: string;
    PassportNumber: string;
    PassportCountry: string;
    PassportCountryCode: string;
    ActivityId: string;
    ParentContactId: string;
    OptedIn: string;
    ImageURL: string;
    IsCreatedViaTestReg: string;
    IsObfuscated: string;
    NationalProviderIdentifier: string
  }
}

interface RegistrationAttributes {
  'xsi:type': string;
  Id: string;
  TargetedListId: string;
  TargetedListName: string;
  InviteeId: string;
  ContactId: string;
  SourceId: string;
  FirstName: string;
  LastName: string;
  Company: string;
  Title: string;
  EmailAddress: string;
  CCEmailAddress: string;
  WorkPhone: string;
  EventId: string;
  EventCode: string;
  EventTitle: string;
  EventStartDate: string;
  Status: string;
  GroupId: string;
  InternalNote: string;
  InvitedBy: string;
  RegistrationDate: string;
  OriginalResponseDate: string;
  LastModifiedDate: string;
  ModifiedBy: string;
  ResponseMethod: string;
  ConfirmationNumber: string;
  RegistrationType: string;
  RegistrationTypeCode: string;
  Participant: string;
  Credit: string;
  ReferenceId: string;
  IsTestRegistrant: string;
}

interface Answer {
  attributes: {
    AnswerText: string;
  }
}

interface SurveyDetail {
  attributes: {
    SurveyType: string;
    QuestionId: string;
    QuestionCode: string;
    QuestionText: string;
  },
  Answer: Answer[];
  AnswerText: string[];
}

interface DiscountItem {
  attributes: {
    DiscountDetailId: string;
    DiscountCode: string;
    DiscountName: string;
    DiscountType: string;
    DiscountValue: string;
    DiscountAmount: string;
  }
}

interface OrderItem {
  attributes: {
    OrderDetailItemId: string;
    OrderDetailId: string;
    FirstName: string;
    LastName: string;
    ProductId: string;
    ProductName: string;
    ProductCode: string;
    Quantity: string;
    ProductType: string;
    ProductDescription: string;
    Action: string;
    ActionDate: string;
    Amount: string;
    AmountPaid: string;
    AmountDue: string;
    OrderNumber: string;
  },
  DiscountDetail: DiscountItem[]
}

export interface Registration {
  attributes: RegistrationAttributes;
  EventSurveyDetail: SurveyDetail[];
  OrderDetail: OrderItem[];
}

interface ProductDetail {
  attributes: {
    ProductId: string;
    ProductName: string;
    ProductCode: string;
    ProductType: string;
    ProductDescription: string;
    SessionCategoryName: string;
    SessionCategoryId: string;
    IsIncluded: string;
    Status: string;
    Capacity: string;
  }
}

interface CustomFieldDetail {
  attributes: {
    FieldName: string;
    FieldType: string;
    FieldValue: string;
    FieldId: string;
  }
}

interface WeblinkDetail {
  attributes: {
    Target: string;
    URL: string;
  }
}

interface TargetListDetail {
  attributes: {
    TargetedListId: string;
    TargetedListName: string;
    TargetedListLanguage: string;
    TargetedListDefault: string;
  }
}

interface EventAttributes {
  'xsi:type': string;
  Id: string;
  EventTitle: string;
  EventCode: string;
  EventStartDate: string;
  EventEndDate: string;
  EventLaunchDate: string;
  Timezone: string;
  EventDescription: string;
  InternalNote: string;
  EventStatus: string;
  Capacity: string;
  Category: string;
  MeetingRequestId: string;
  Currency: string;
  PlanningStatus: string;
  Location: string;
  StreetAddress1: string;
  StreetAddress2: string;
  StreetAddress3: string;
  City: string;
  State: string;
  StateCode: string;
  PostalCode: string;
  Country: string;
  CountryCode: string;
  PhoneNumber: string;
  PlannerFirstName: string;
  PlannerLastName: string;
  PlannerEmailAddress: string;
  PlannerPrefix: string;
  PlannerCompany: string;
  PlannerTitle: string;
  LastModifiedDate: string;
  RSVPbyDate: string;
  ArchiveDate: string;
  ClosedBy: string;
  ExternalAuthentication: string;
  StakeholderFirstName: string;
  StakeholderLastName: string;
  StakeholderEmailAddress: string;
  StakeholderTitle: string;
  StakeholderCompany: string;
  StakeholderWorkPhone: string;
  StakeholderHomePhone: string;
  StakeholderWorkFax: string;
  StakeholderMobilePhone: string;
  StakeholderAddress1: string;
  StakeholderAddress2: string;
  StakeholderAddress3: string;
  StakeholderCity: string;
  StakeholderStateCode: string;
  StakeholderPostalCode: string;
  StakeholderCountryCode: string;
  MerchantAccount: string;
  MerchantAccountId: string;
  CreatedBy: string;
  EventCalendarLinkText: string;
  EventCalendarAlternateURL: string;
  EventCalendarCompletedURL: string;
}

export interface Event {
  attributes: EventAttributes;
  ProductDetail: ProductDetail[];
  CustomFieldDetail: CustomFieldDetail[];
  WeblinkDetail: WeblinkDetail[];
  TargetListDetail: TargetListDetail[];
}