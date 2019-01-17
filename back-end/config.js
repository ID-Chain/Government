/* eslint camelcase: 0 */

const PASSPORT_SCHEMA_NAME = 'passport';
const PASSPORT_SCHEMA_FIELDS = [
    'issuance_time@unix_time', // IMPORTANT NOT TO FORGET THE AUTOMATICALLY ADDED FIELD
    'bsn@integer',
    'document_number@integer',
    'surname@string',
    'given_name@string',
    'gender@string',
    'nationality_code@string',
    'birth_date@inverted_unix_time',
    'birth_place@string',
    'authority@string',
    'date_of_issue@unix_time',
    'date_of_expiry@unix_time'
];
const PASSPORT_SCHEMA_FIELDS_SUBMIT = [
    {
        name: 'bsn',
        type: 'integer'
    },
    {
        name: 'document_number',
        type: 'integer'
    },
    {
        name: 'surname',
        type: 'string'
    },
    {
        name: 'given_name',
        type: 'string'
    },
    {
        name: 'gender',
        type: 'string'
    },
    {
        name: 'nationality_code',
        type: 'string'
    },
    {
        name: 'birth_date',
        type: 'inverted_unix_time'
    },
    {
        name: 'birth_place',
        type: 'string'
    },
    {
        name: 'authority',
        type: 'string'
    },
    {
        name: 'date_of_issue',
        type: 'unix_time'
    },
    {
        name: 'date_of_expiry',
        type: 'unix_time'
    }
];

module.exports = {
    PASSPORT_SCHEMA_NAME,
    PASSPORT_SCHEMA_FIELDS,
    PASSPORT_SCHEMA_FIELDS_SUBMIT
};
