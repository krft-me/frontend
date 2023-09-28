package me.krft.frontend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import me.krft.frontend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShowcaseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Showcase.class);
        Showcase showcase1 = new Showcase();
        showcase1.setId(1L);
        Showcase showcase2 = new Showcase();
        showcase2.setId(showcase1.getId());
        assertThat(showcase1).isEqualTo(showcase2);
        showcase2.setId(2L);
        assertThat(showcase1).isNotEqualTo(showcase2);
        showcase1.setId(null);
        assertThat(showcase1).isNotEqualTo(showcase2);
    }
}
