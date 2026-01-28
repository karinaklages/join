let animationTimeout1;
let animationTimeout2;


/**
 * Orchestrates the mobile greeting animation sequence.
 */
function runMobileGreetingAnimation() {
    const { metrics, greeting, header } = getSummaryElements();
    if (!metrics || !greeting) return;
    setInitialAnimationState(metrics, greeting, header);
    animationTimeout1 = setTimeout(() => {
        greeting.classList.remove('fade_in_animation');
        greeting.classList.add('fade_out_animation');
    }, 1500);
    animationTimeout2 = setTimeout(() => {
        finalizeMobileAnimation(metrics, greeting, header);
    }, 2500);
}


/**
 * Resets the layout immediately without animation (used on resize/refresh).
 */
function updateLayoutWithoutAnimation() {
    const { metrics, greeting, header } = getSummaryElements();
    if (!metrics || !greeting) return;
    document.documentElement.classList.remove('hide-header-initially');
    resetAnimationClasses(metrics, greeting, header);
    applyResponsiveVisibility(metrics, greeting);
    if (header && window.innerWidth <= 1220) {
        header.style.display = 'flex';
    } else if (header) {
        header.style.display = ''; 
    }
}


/**
 * Helper: Retrieves the necessary DOM elements.
 */
function getSummaryElements() {
    return {
        metrics: document.getElementById('id_summary_metrics_container'),
        greeting: document.getElementById('id_summary_greeting_container'),
        header: document.querySelector('.summary_header')
    };
}


/**
 * Helper: Sets the initial state for the animation (hides content, shows greeting).
 */
function setInitialAnimationState(metrics, greeting, header) {
    metrics.classList.add('d_none');
    if (header) header.classList.add('d_none');
    greeting.classList.add('mobile_greeting_overlay');
    greeting.classList.add('fade_in_animation');
}


/**
 * Helper: Finalizes the animation by hiding greeting and showing content.
 */
function finalizeMobileAnimation(metrics, greeting, header) {
    greeting.classList.add('d_none');
    greeting.classList.remove('mobile_greeting_overlay', 'fade_out_animation');
    metrics.classList.remove('d_none');
    metrics.classList.add('fade_in_animation');
    document.documentElement.classList.remove('hide-header-initially');
    if (header) {
        header.classList.remove('d_none');
        header.classList.add('fade_in_animation');
        header.style.display = 'flex'; 
    }
}


/**
 * Helper: Clears timeouts and removes animation classes.
 */
function resetAnimationClasses(metrics, greeting, header) {
    clearTimeout(animationTimeout1);
    clearTimeout(animationTimeout2);
    greeting.classList.remove('mobile_greeting_overlay', 'fade_in_animation', 'fade_out_animation');
    metrics.classList.remove('fade_in_animation');
    if (header) {
        header.classList.remove('fade_in_animation');
        header.classList.remove('d_none');
    }
}


/**
 * Helper: Applies visibility based on screen width (Desktop vs Mobile).
 */
function applyResponsiveVisibility(metrics, greeting) {
    if (window.innerWidth > 1220) {
        metrics.classList.remove('d_none');
        greeting.classList.remove('d_none');
        greeting.style.opacity = '1';
    } else {
        metrics.classList.remove('d_none');
        greeting.classList.add('d_none');
    }
}


/**
 * Decides whether to run the animation or update the static layout.
 */
function handleSummaryView(shouldShowAnimation) {
    if (shouldShowAnimation && window.innerWidth <= 1220) {
        runMobileGreetingAnimation();
    } else {
        updateLayoutWithoutAnimation();
    }
    localStorage.removeItem("showMobileGreeting");
    window.addEventListener('resize', updateLayoutWithoutAnimation);
}


/**
 * Helper: Prepars the greeting text and username.
 */
function getGreetingData(user) {
    let greeting = getGreeting();
    if (user && user.name !== "Guest") {
        return { userName: user.name, greetingText: greeting + "," };
    }
    return { userName: "", greetingText: greeting + "!" };
}