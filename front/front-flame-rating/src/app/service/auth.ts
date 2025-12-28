import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de tu backend de Spring Boot
  private readonly apiUrl = 'http://localhost:8080/api/users';

  // BehaviorSubject para almacenar el estado del usuario logueado
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializa el estado, leyendo la sesión si existe (usando sessionStorage para persistencia simple)
    const storedUser = sessionStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // ----------------------------------------------------
  // MÉTODOS DE AUTENTICACIÓN
  // ----------------------------------------------------

  /**
   * 1. Lógica para el Registro de Usuario
   */
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      tap((registeredUser) => {
        // En un proyecto real, el registro no debería loguear automáticamente, 
        // pero aquí lo usamos para simplificar.
        this.setSession(registeredUser);
      }),
      catchError(error => {
        // Manejo de errores de HTTP (ej. 409 Conflict si ya existe el email/username)
        console.error('Error durante el registro:', error);
        throw error; // Propaga el error para que el componente lo muestre
      })
    );
  }

  /**
   * 2. Lógica para el Inicio de Sesión
   */
  login(username: string, password: string): Observable<User> {
    const loginRequest = { username: username, password: password } as Partial<User>;

    return this.http.post<User>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap(user => {
        // Si el login es exitoso, guarda la sesión
        this.setSession(user);
        this.router.navigate(['/']); // Redirige a la página principal
      }),
      catchError(error => {
        console.error('Error durante el login:', error);
        throw error; // Propaga el error (ej. 401 Unauthorized)
      })
    );
  }

  /**
   * 3. Lógica de Cierre de Sesión
   */
  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

    // --- NUEVOS MÉTODOS PARA EL SPRINT 2 ---

  /**
   * 4. Lógica para Modificar Usuario
   * @param idUser ID del usuario a modificar
   * @param userDetails Objeto con los nuevos datos
   */
  updateUser(idUser: number, userDetails: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${idUser}`, userDetails).pipe(
      tap(updatedUser => {
        // MUY IMPORTANTE: Si el usuario modificado es el mismo que está logueado,
        // actualizamos la sesión local para que la UI se refresque.
        if (this.currentUserValue?.idUser === updatedUser.idUser) {
          this.setSession(updatedUser);
        }
      }),
      catchError(error => {
        console.error('Error al actualizar usuario:', error);
        throw error;
      })
    );
  }

  /**
   * 5. Lógica para Eliminar Usuario
   * @param idUser ID del usuario a borrar
   */
  deleteUser(idUser: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${idUser}`).pipe(
      tap(() => {
        // Si el usuario borrado es el que tiene la sesión iniciada, cerramos sesión.
        if (this.currentUserValue?.idUser === idUser) {
          this.logout();
        }
      }),
      catchError(error => {
        console.error('Error al eliminar usuario:', error);
        throw error;
      })
    );
  }

  // ----------------------------------------------------
  // MÉTODOS DE SOPORTE
  // ----------------------------------------------------

  /**
   * Verifica si hay un usuario activo
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Guarda el objeto User en sessionStorage
   */
  private setSession(user: User): void {
    // OJO: Guardar el objeto User con la password es inseguro. 
    // En un proyecto real, solo se guarda el token JWT.
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
