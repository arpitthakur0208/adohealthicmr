import * as videoRepository from '../repositories/videoRepository.js';

export async function list(req, res, next) {
  try {
    const moduleId = req.query.moduleId ? parseInt(req.query.moduleId, 10) : undefined;
    const videoType = req.query.videoType;
    const videos = await videoRepository.findAll(
      isNaN(moduleId) ? undefined : moduleId,
      videoType || undefined
    );
    return res.json({ success: true, videos });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { moduleId, videoType, videoId, preview, fileName, fileSize, fileUrl, uploadedBy } = req.body;
    if (!moduleId || !videoType || videoId === undefined) {
      return res.status(400).json({ error: 'moduleId, videoType, videoId required' });
    }
    const video = await videoRepository.create({
      moduleId, videoType, videoId, preview, fileName, fileSize, fileUrl, uploadedBy,
    });
    return res.status(201).json({ success: true, video });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const moduleId = parseInt(req.params.moduleId, 10);
    const videoType = req.params.videoType;
    const videoId = parseInt(req.params.videoId, 10);
    if (isNaN(moduleId) || !videoType || isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid moduleId, videoType, or videoId' });
    }
    const ok = await videoRepository.remove(moduleId, videoType, videoId);
    if (!ok) return res.status(404).json({ success: false, error: 'Video not found' });
    return res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
}
