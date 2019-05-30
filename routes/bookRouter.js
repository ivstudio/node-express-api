/* eslint-disable no-param-reassign */
const express = require('express');
const Book = require('../models/bookModel');
const bookController = require('../controllers/booksController');

const bookRouter = express.Router();

const controller = bookController(Book);

bookRouter.post('/', controller.post);

bookRouter.get('/', controller.get);

bookRouter.use('/:bookId', (req, res, next) => {
	Book.findById(req.params.bookId, (err, book) => {
		if (err) {
			return res.send(err);
		}

		if (book) {
			req.book = book;
			return next();
		}
		return res.sendStatus(404);
	});
});

bookRouter.get('/:bookId', (req, res) => {
	const booksFilered = req.book.toJSON();
	const genre = req.book.genre.replace(' ', '%20');

	booksFilered.links = {};
	booksFilered.links.self = `http://${req.headers.host}/api/books/?genre=${genre}`;

	res.json(booksFilered);
});

bookRouter.put('/:bookId', (req, res) => {
	const { book } = req;
	book.read = req.body.read;
	book.title = req.body.title;
	book.genre = req.body.genre;
	book.author = req.body.author;

	req.book.save(err => {
		if (err) return res.send(err);

		return res.json(book);
	});
});

bookRouter.patch('/:bookId', (req, res) => {
	const { book } = req;
	/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

	if (req.body._id) {
		delete req.body._id;
	}

	Object.entries(req.body).forEach(item => {
		const key = item[0];
		const value = item[1];

		book[key] = value;
	});

	req.book.save(err => {
		if (err) return res.send(err);

		return res.json(book);
	});
});

bookRouter.delete('/:bookId', (req, res) => {
	req.book.remove(err => {
		if (err) {
			return res.send(err);
		}
		return res.sendStatus(204);
	});
});

module.exports = bookRouter;
