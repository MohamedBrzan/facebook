const User = require('../models/User');
const Album = require('../models/Album');
const Page = require('../models/Page');
const AsyncHandler = require('../utils/AsyncHandler');
const ErrorHandler = require('../middleWares/ErrorHandler');
const { unlink, link } = require('node:fs/promises');
const Group = require('../models/Group');

//************************************** Profile Album **************************************//

// Get Album
exports.GetAllAlbums = AsyncHandler(async (req, res, next) => {
  const albums = await Album.find();

  return res.status(200).json(albums);
});

// Get Album
exports.GetAlbum = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorHandler('User Not Found', 500));

  const album = await Album.findById(req.params.id);

  if (!album) return next(new ErrorHandler('Album Not Found', 500));

  return res.status(200).json(album);
});

// Create Album
exports.CreateAlbum = AsyncHandler(async (req, res, next) => {
  const { title, description, groupId, pageId } = req.body;

  const photos = req.files;

  const album = await Album.create({ title, description, photos });

  if (groupId) {
    const group = await Group.findById(groupId);

    if (!group) return next(new ErrorHandler('Group Not Found', 404));

    group.albums.push(album);

    await group.save();

    return res
      .status(200)
      .json({ message: 'Album Added To Group Successfully', album });
  } else if (pageId) {
    const page = await Page.findById(groupId);

    if (!page) return next(new ErrorHandler('Page Not Found', 404));

    page.albums.push(album);

    await page.save();

    return res
      .status(200)
      .json({ message: 'Album Added To Page Successfully', album });
  } else {
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorHandler('User Not Found', 500));

    user.albums.push(album);

    await user.save();

    return res
      .status(200)
      .json({ message: 'Album Added To User Successfully', album });
  }
});

// Update Album
exports.UpdateAlbum = AsyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  const album = await Album.findById(req.params.id);

  if (!album) return next(new ErrorHandler('Album Not Found', 500));

  const photos = req.files;

  await Album.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true, runValidators: true }
  );

  if (photos) {
    photos.map((photo) =>
      album.photos.push({
        fieldname: photo.fieldname,
        originalname: photo.originalname,
        encoding: photo.encoding,
        mimetype: photo.mimetype,
        destination: photo.destination,
        filename: photo.filename,
        path: photo.path,
        size: photo.size,
      })
    );

    await album.save();
  }

  return res.status(200).json(album);
});

// Update Photo
exports.UpdatePhoto = AsyncHandler(async (req, res, next) => {
  const { photoId, filename } = req.body;

  const album = await Album.findById(req.params.id);

  if (!album) return next(new ErrorHandler('Album Not Found', 500));

  const photo = req.file;

  let findPhoto = album.photos.id(photoId);

  if (!findPhoto) return next(new ErrorHandler('Photo Not Found', 500));

  await unlink(`uploads/images/albums/${filename}`);

  (findPhoto.fieldname = photo.fieldname),
    (findPhoto.originalname = photo.originalname),
    (findPhoto.encoding = photo.encoding),
    (findPhoto.mimetype = photo.mimetype),
    (findPhoto.destination = photo.destination),
    (findPhoto.filename = photo.filename),
    (findPhoto.path = photo.path),
    (findPhoto.size = photo.size),
    (findPhoto.date = Date.now()),
    await album.save();

  return res.status(200).json(album);
});

// Delete Photo
exports.DeletePhoto = AsyncHandler(async (req, res, next) => {
  const { photoId, filename } = req.body;

  const album = await Album.findById(req.params.id);

  if (!album) return next(new ErrorHandler('Album Not Found', 500));

  let findPhoto = album.photos.id(photoId);

  if (!findPhoto) return next(new ErrorHandler('Photo Not Found', 500));

  await unlink(`uploads/images/albums/${filename}`);

  album.photos.pull(findPhoto);

  await album.save();

  return res.status(200).json({ message: 'Photo Deleted Successfully' });
});

// Delete All Album Photos
exports.DeleteAllAlbumPhotos = AsyncHandler(async (req, res, next) => {
  const album = await Album.findById(req.params.id);

  if (!album) return next(new ErrorHandler('Album Not Found', 500));

  album.photos = [];

  for (let i = 0; i < album.photos.length; i++) {
    await unlink(`uploads/images/albums/${album.photos[i].filename}`);
  }

  await album.save();

  return res.status(200).json(album);
});

// Delete Album
exports.DeleteAlbum = AsyncHandler(async (req, res, next) => {
  const { groupId, pageId } = req.body;

  const album = await Album.findById(req.params.id);

  if (!album) return next(new ErrorHandler('Album Not Found', 500));

  for (let i = 0; i < album.photos.length; i++) {
    await unlink(`uploads/images/albums/${album.photos[i].filename}`);
  }

  if (groupId) {
    const group = await Group.findById(groupId);

    if (!group) return next(new ErrorHandler('Group Not Found', 404));

    group.albums.pull(album);

    await group.save();
  } else if (pageId) {
    const page = await Page.findById(groupId);

    if (!page) return next(new ErrorHandler('Page Not Found', 404));

    page.albums.pull(album);

    await page.save();
  } else {
    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorHandler('User Not Found', 500));

    user.albums.pull(album);

    await user.save();
  }

  await Album.findByIdAndDelete(req.params.id);

  return res.status(200).json({ message: 'Album Deleted Successfully' });
});
