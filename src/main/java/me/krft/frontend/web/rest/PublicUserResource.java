package me.krft.frontend.web.rest;

import java.util.ArrayList;
import java.util.List;
import me.krft.frontend.service.UserService;
import me.krft.frontend.service.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequestMapping("/api")
public class PublicUserResource {

    private final Logger log = LoggerFactory.getLogger(PublicUserResource.class);

    private final UserService userService;

    public PublicUserResource(UserService userService) {
        this.userService = userService;
    }

    /**
     * {@code GET /users} : get all users with only the public informations - calling this are allowed for anyone.
     *
     * @param request a {@link ServerHttpRequest} request.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users")
    public Mono<ResponseEntity<Flux<UserDTO>>> getAllPublicUsers(
        ServerHttpRequest request,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get all public User names");

        return userService
            .countManagedUsers()
            .map(total -> new PageImpl<>(new ArrayList<>(), pageable, total))
            .map(page ->
                ResponseEntity
                    .ok()
                    .headers(PaginationUtil.generatePaginationHttpHeaders(UriComponentsBuilder.fromHttpRequest(request), page))
                    .body(userService.getAllPublicUsers(pageable))
            );
    }

    /**
     * Gets a list of all roles.
     * @return a string list of all roles.
     */
    @GetMapping("/authorities")
    public Mono<List<String>> getAuthorities() {
        return userService.getAuthorities().collectList();
    }
}
