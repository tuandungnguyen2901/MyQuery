const Call = require("../model/callModel");

exports.createCall = async (req, res) => {
  try {
    const { id, signalData } = req.body;
    const call = await Call.findOne({ id: id });
    if (call) return res.status(400).json({ msg: "The call already existed" });
    const newCall = await Wallet.create({
      id: id,
      signalData: JSON.stringify(signalData),
    });
    res.status(201).json({ msg: "Create call successfully ", data: newCall });
  } catch (ex) {
    res.status(500).json({ msg: ex.message || "Something went wrong" });
  }
};

exports.getCall = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "Invalid id" });
    const call = await Call.findOne({ id: id });
    if (!call) return res.status(404).json({ msg: "Call not found!" });
    return res.status(200).json({ msg: "Success", data: call });
  } catch (ex) {
    res.status(500).json({ msg: ex.message || "Something went wrong" });
  }
};
