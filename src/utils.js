export function getCurrentUser() {
    return localStorage.getItem('currentUser') || undefined
}