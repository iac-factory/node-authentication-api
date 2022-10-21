import crypto from "crypto";

export const Schema = async () => {
    // const user = {
    //     id:            crypto.randomUUID({ disableEntropyCache: true }),
    //     email:         faker.internet.email( first, last ),
    //     description:   faker.lorem.sentences( 1 ),
    //     avatar:        faker.internet.avatar(),
    //     comment:       [ faker.random.word(), faker.random.word(), faker.random.word() ],
    //     administrator: false,
    //     username:      faker.internet.userName( first, last ),
    //     password:      faker.internet.password( 16 ),
    //     rotation:      faker.date.future( 1 ),
    //     login:         {
    //         date:       faker.date.past( 1 ),
    //         expiration: faker.date.soon( 1 ),
    //         origin:     faker.internet.ip()
    //     },
    //     role:          faker.datatype.number( 16 ),
    //     /*** Generate Arbitrary Entitlements from Company Buzzword(s) (Nouns) */
    //     entitlements: [ ... new Set(
    //         [ ... Array.from( { length: crypto.randomInt( 5 ) } ).map( () => {
    //             const word = faker.company.bsNoun();
    //             const capital = word[ 0 ]!.toUpperCase();
    //             return [ capital, word.slice( 1 ) ].join( "" ).replace( " ", "-" );
    //         } ), ... Array.from( { length: crypto.randomInt( 5 ) } ).map( () => {
    //             const word = faker.company.bsBuzz();
    //             const capital = word[ 0 ]!.toUpperCase();
    //             return [ capital, word.slice( 1 ) ].join( "" ).replace( " ", "-" );
    //         } ) ]
    //     ) ],
    //     version:      faker.system.semver(),
    //     creation:     new Date( Date.now() ),
    //     modification: new Date( Date.now() ),
    //     name:         [ first, last ].join( " " )
    // };
}