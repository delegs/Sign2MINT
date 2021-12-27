package de.wps.sign2MintServer.repositories;

import de.wps.sign2MintServer.mappers.LexikonEintragMapper;
import de.wps.sign2MintServer.services.CacheService;
import de.wps.sign2MintServer.services.FrameGrabService;
import de.wps.sign2MintServer.validation.LexikonEintragsJsonValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.net.http.HttpClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class LexikoneintragRepositoryIntegrationTest {

    @Mock
    private HttpClient httpClient;
    @Mock
    private FrameGrabService frameGrabService;

    private LexikoneintragRepository lexikoneintragRepository;

    @BeforeEach
    void setUp() {

        lexikoneintragRepository = new LexikoneintragRepository(httpClient, new LexikonEintragMapper(), new LexikonEintragsJsonValidator(), frameGrabService, new CacheService());
    }

    @Test
    void shouldInitializeAllSymbolKeys() {
        // Act
        final var result = lexikoneintragRepository.findAll();

        // Assert
        assertThat(result).allMatch(lexikoneintrag ->
                lexikoneintrag.getGebaerdenschrift()
                        .getSymbolIds()
                        .stream()
                        .noneMatch(symbolId -> symbolId.getSymbolKey().isEmpty()));
    }

    @Test
    void shouldGenerateThumbnails() {
        // Act
        final var result = lexikoneintragRepository.findAll();

        // Assert
        var minInvocationCount = result.isEmpty() ? 0 : 1;
        verify(frameGrabService, atLeast(minInvocationCount)).getThumbnailForVideo(any());
    }
}
