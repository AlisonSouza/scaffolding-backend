const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');
const Purchase = require('../models/purchase');
const Income = require('../models/income');
const Portifolio = require('../models/portifolio');
const Company = require('../models/company');
const User = require('../models/user');
const PortifolioCompany = require('../models/portifolioCompany');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLFloat
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        portifolio: {
            type: new GraphQLList(PortifolioType),
            resolve(parent, args){
                return Portifolio.find({userId: parent.id});
            }
        }
    })
});

const PortifolioCompanyType = new GraphQLObjectType({
    name: 'PortifolioCompany',
    fields: () => ({
        id: {type: GraphQLID},
        portifolioId: {type: GraphQLID},
        company: {
            type: CompanyType,
            resolve(parent, args){
                return Company.findById(parent.companyId);
            }
        },
        purchases: {
            type: new GraphQLList(PurchaseType),
            resolve(parent, args){
                return Purchase.find({portifolioCompanyId: parent.id});
            }
        }
    })
});

const PortifolioType = new GraphQLObjectType({
    name: 'Portifolio',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        portifolioCompany: {
            type: new GraphQLList(PortifolioCompanyType),

            resolve(parent, args){
                return PortifolioCompany.find({portifolioId: parent.id});
            }
        }
    })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        code: {type: GraphQLString},
        income: {
            type: new GraphQLList(IncomeType),
            resolve(parent, args){
                return Income.find({companyId: parent.id});
            }
        }
    })
});

const PurchaseType = new GraphQLObjectType({
    name: 'Purchase',
    fields: () => ({
        id: {type: GraphQLID},
        price: {type: GraphQLString},
        quantity: {type: GraphQLInt},
        purchaseDate: {type: GraphQLInt},
        portifolioCompany: {
            type: PortifolioCompanyType,
            resolve(parent, args){
                return PortifolioCompany.findById(parent.portifolioCompanyId);
            }
        },
        company: {
            type: CompanyType,
            resolve(parent, args){

                return Company.findById(parent.companyId);
            }
        }
    })
});

const IncomeType = new GraphQLObjectType({
    name: 'Income',
    fields: () => ({
        id: {type: GraphQLID},
        receiveDate: {type: GraphQLString},
        value: {type: GraphQLFloat},
        incomeType: {type: GraphQLString},
        company: {
            type: CompanyType,
            resolve(parent, args){
                return Company.findById(parent.companyId);
            }
        }
    })
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            purchase: {
                type: PurchaseType,
                args: {id:{type: GraphQLID}},
                resolve(parent, args){
                    return Purchase.findById(args.id);
                }
            },
            portifolioCompany: {
                type: PortifolioCompanyType,
                args: {id:{type: GraphQLID}},
                resolve(parent, args){
                    return PortifolioCompany.find({portifolioId: args.portifolioId});
                }
            },
            portifolio: {
                type: PortifolioType,
                args: {id:{type: GraphQLID}},
                resolve(parent, args){
                    return Portifolio.findById(args.id);
                }
            },
            user: {
                type: UserType,
                args: {id:{type: GraphQLID}},
                resolve(parent, args){
                    return User.findById(args.id);
                }
            },
            company: {
                type: CompanyType,
                args: {id:{type: GraphQLID}},
                resolve(parent, args){
                    return Company.findById(args.id);
                }
            },
            income: {
                type: IncomeType,
                args: {id:{type: GraphQLID}},
                resolve(parent, args){
                    return Income.findById(args.id);
                }
            },
            book: {
                type: BookType,
                args: {id:{type: GraphQLID}},
                resolve(parent, args) {
                    return Book.findById(args.id);
                }
            },
            author: {
                type: AuthorType,
                args: {id:{type:GraphQLID}},
                resolve(parent, args){
                    return Author.findById(args.id);
                }
            },
            companies: {
                type: new GraphQLList(CompanyType),
                resolve(parent, args){
                    return Company.find({});
                }
            },
            books: {
                type: new GraphQLList(BookType),
                resolve(parent, args){
                    return Book.find({});
                }
            },
            authors: {
                type: new GraphQLList(AuthorType),
                resolve(parent, args){
                    return Author.find({});
                }
            }
        }
    });

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPurchase: {
            type: PurchaseType,
            args: {
                companyId: {type: new GraphQLNonNull(GraphQLID)},
                portifolioCompanyId: {type: new GraphQLNonNull(GraphQLID)},
                quantity: {type: new GraphQLNonNull(GraphQLFloat)},
                price: {type: new GraphQLNonNull(GraphQLString)},
                purchaseDate: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let purchase = new Purchase({
                    companyId: args.companyId,
                    portifolioCompanyId: args.portifolioCompanyId,
                    quantity: args.quantity,
                    price: args.price,
                    purchaseDate: args.purchaseDate
                });
                return purchase.save();
            }
        },
        addPortifolioCompany: {
            type: PortifolioCompanyType,
            args: {
                portifolioId: {type: new GraphQLNonNull(GraphQLID)},
                companyId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let portifolioCompany = new PortifolioCompany({
                    portifolioId: args.portifolioId,
                    companyId: args.companyId
                });
                return portifolioCompany.save();
            }
        },
        addUser: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    email: args.email
                });
                return user.save();
            }
        },
        addPortifolio: {
            type: PortifolioType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let portifolio = new Portifolio({
                    name: args.name,
                    userId: args.userId
                });
                return portifolio.save();
            }
        },
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        addCompany: {
            type: CompanyType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                code: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let company = new Company({
                    name: args.name,
                    code: args.code
                });
                return company.save();
            }
        },
        addIncome: {
            type: IncomeType,
            args: {
                exDividendDate: {type: GraphQLString},
                earningsDate: {type: GraphQLString},
                incomeType: {type: new GraphQLNonNull(GraphQLString)},
                value: {type: new GraphQLNonNull(GraphQLString)},
                companyId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let income = new Income({
                    exDividendDate: args.exDividendDate,
                    earningsDate: args.earningsDate,
                    incomeType: args.incomeType,
                    value: args.value,
                    companyId: args.companyId
                });
                return income.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
