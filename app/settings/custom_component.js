class CustomAppComponent extends HTMLElement {
    parameters = {
        stylesUrl: [],
        templateHTML: undefined,
        templateUrl: undefined
    };
    constructor(component, parameters) {
        super();
        this.attachShadow({ mode: 'open' });
        // Crear la promesa que se resolverá cuando los recursos estén cargados
        this.loadPromise = new Promise((resolve, reject) => {
            this.resolveLoadPromise = resolve;
        });
        this.parameters = parameters;
        // Cargar los recursos y resolver la promesa cuando estén cargados
        this.loadResources(component);

    }
    async loadResources(component) {
        const promises = [];
        if (this.parameters.templateUrl) promises.push(fetch(`src/components/${component}/${component}.view.html`)
            .then(response => response.text())
            .then(html => {
                this.shadowRoot.innerHTML = html;
            }))
        else if (this.parameters.templateHTML) this.shadowRoot.innerHTML = this.parameters.templateHTML;
        const styles = document.createElement('style');
        this.parameters.stylesUrl.map((styleUrl) => {
            promises.push(fetch(`src/components/${component}/${styleUrl.replace('scss', 'css')}`)
                .then(response => response.text())
                .then(css => {
                    styles.remove();
                    styles.innerHTML = `${styles.innerHTML} ${css}`;
                    this.shadowRoot.insertBefore(styles, this.shadowRoot.firstChild);
                }))
        })
        await Promise.all(promises);
        // Resolver la promesa una vez que los recursos estén cargados
        this.resolveLoadPromise();
    }
}

export default CustomAppComponent;