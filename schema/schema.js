const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');

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
        userName: {type: GraphQLString},
        email: {type: GraphQLString}
    })
});

const PortifolioType = new GraphQLObjectType({
    name: 'Portifolio',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return UserType.findById(parent.userId);
            } 
        }
    })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        code: {type: GraphQLString}
    })
});

const PurchaseType = new GraphQLObjectType({
    name: 'Purchase',
    fields: () => ({
        id: {type: GraphQLID},
        price: {type: GraphQLInt},
        quantity: {type: GraphQLInt},
        purchaseDate: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parent, args){
                return null;
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
                return company.findById(parent.companyId);
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
        addAuthor:{
            type: AuthorType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
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
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
