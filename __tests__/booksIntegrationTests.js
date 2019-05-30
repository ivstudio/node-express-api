require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app.js');

process.env.ENV = 'Test';
const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book crud test', () => {
	it('should allow a book to be posted an return red and _it', done => {
		const bookPost = {
			title: 'My Book',
			author: 'Jon',
			genre: 'Fiction'
		};

		agent
			.post('/api/books')
			.send(bookPost)
			.expect(200)
			.end((err, result) => {
				result.body.should.have.property('_id');
				done();
			});
	});

	afterEach(done => {
		Book.deleteMany({}).exec();
		done();
	});

	after(done => {
		mongoose.connection.close();
		app.server.close(done());
	});
});
