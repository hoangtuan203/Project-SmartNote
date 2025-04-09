package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.ShareResponse;
import com.example.be_smartnote.entities.Share;
import com.example.be_smartnote.mapper.ShareMapper;
import com.example.be_smartnote.repository.ShareRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShareService {
    private final ShareRepository shareRepository;
    private final ShareMapper shareMapper;

    public ShareService(ShareRepository shareRepository, ShareMapper shareMapper) {
        this.shareRepository = shareRepository;
        this.shareMapper = shareMapper;
    }

    public List<ShareResponse> getAllShares(Long userId) {
        List<Share> shares = shareRepository.findAllShareByUserId(userId);
        return shares.stream()
                .map(shareMapper::toShareResponse)
                .collect(Collectors.toList());
    }
    public List<ShareResponse> getShareWithApprove(Long userId) {
        List<Share> shares = shareRepository.getShareByApprove(userId);
        return shares.stream()
                .map(shareMapper::toShareResponse)
                .collect(Collectors.toList());
    }
}
