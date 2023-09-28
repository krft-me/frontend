package me.krft.frontend.domain;

import static org.assertj.core.api.Assertions.assertThat;

import me.krft.frontend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ApplicationUserBadgeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ApplicationUserBadge.class);
        ApplicationUserBadge applicationUserBadge1 = new ApplicationUserBadge();
        applicationUserBadge1.setId(1L);
        ApplicationUserBadge applicationUserBadge2 = new ApplicationUserBadge();
        applicationUserBadge2.setId(applicationUserBadge1.getId());
        assertThat(applicationUserBadge1).isEqualTo(applicationUserBadge2);
        applicationUserBadge2.setId(2L);
        assertThat(applicationUserBadge1).isNotEqualTo(applicationUserBadge2);
        applicationUserBadge1.setId(null);
        assertThat(applicationUserBadge1).isNotEqualTo(applicationUserBadge2);
    }
}
