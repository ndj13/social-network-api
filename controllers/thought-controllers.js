const { Thought, User } = require('../models');

const thoughtController =
{
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
//wrote this with assistance from peer: Kyle
    // get thought by id 
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({message: "No thought found with this id "});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // add thought
    createThought(req, res) {
        Thought.create(req.body)
            .then(dbThoughtData => {
                User.findByIdAndUpdate
                    ({ _id: req.params.userId }, { $push: { thoughts: dbThoughtData._id } }, { new: true })
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    },

    // update thought by id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }  )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No though found with this id! " });
                    return;
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err));},

    // delete thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    return res.status(404).json({ messgae: "No THOUGHT found with this id! " });
                }

                return User.findOneAndUpdate
                    ({ _id: req.params.username }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });},

    // create reaction complete
    createReaction(req, res) {
        Thought.findOneAndUpdate
            (
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true }
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ messgae: " No THOUGHT found with this id! " });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    },

    // remove reaction complete
    deleteReaction(req, res) {
        Thought.findOneAndUpdate
            (
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { new: true }
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: " No THOUGHT found withi this id! " });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            })
    }
};

module.exports = thoughtController;