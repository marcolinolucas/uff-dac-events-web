<template>
	<b-overlay :show="isLoading" rounded="sm">
		<b-card v-if="article" class="article-wrapper">
			<b-row class="mb-3">
				<b-col>
					<h3>Informações do artigo {{ article.originalTitle }}</h3>
				</b-col>
				<b-col class="d-flex justify-content-end">
					<b-button @click="$router.push(`/volume/${volumeId}`)" variant="success">Voltar</b-button>
				</b-col>
			</b-row>

			<p>Id: <b>{{ article.id }}</b></p>

			<p>
				Ordem:
				<span class="volume-value edit" @click="() => (changeInput.volumeOrder = true)">{{
					article.volumeOrder
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.volumeOrder"
					v-model="article.volumeOrder"
				></b-form-input>
			</p>

			<p>
				Linguagem:
				<span class="volume-value edit" @click="() => (changeInput.language = true)">{{
					article.language
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.language"
					v-model="article.language"
				></b-form-input>
			</p>

			<p>
				Título original:
				<span class="volume-value edit" @click="() => (changeInput.originalTitle = true)">{{
					article.originalTitle
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.originalTitle"
					v-model="article.originalTitle"
				></b-form-input>
			</p>

			<p>
				Título em inglês:
				<span class="volume-value edit" @click="() => (changeInput.englishTitle = true)">{{
					article.englishTitle
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.englishTitle"
					v-model="article.englishTitle"
				></b-form-input>
			</p>

			<p>
				Sumário original:
				<span class="volume-value edit" @click="() => (changeInput.originalSummary = true)">{{
					article.originalSummary
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.originalSummary"
					v-model="article.originalSummary"
				></b-form-input>
			</p>

			<p>
				Sumário em inglês:
				<span class="volume-value edit" @click="() => (changeInput.englishSummary = true)">{{
					article.englishSummary
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.englishSummary"
					v-model="article.englishSummary"
				></b-form-input>
			</p>

			<p>
				Palavras-chave originais:
				<span class="volume-value edit" @click="() => (changeInput.originalKeywords = true)">{{
					article.originalKeywords
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.originalKeywords"
					v-model="article.originalKeywords"
				></b-form-input>
			</p>

			<p>
				Palavras-chave em inglês:
				<span class="volume-value edit" @click="() => (changeInput.englishKeywords = true)">{{
					article.englishKeywords
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.englishKeywords"
					v-model="article.englishKeywords"
				></b-form-input>
			</p>

			<p>
				Número de páginas:
				<span class="volume-value edit" @click="() => (changeInput.numberOfPages = true)">{{
					article.numberOfPages
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.numberOfPages"
					v-model="article.numberOfPages"
				></b-form-input>
			</p>

			<b-row class="mt-3" v-if="editingArticle">
				<b-col>
					<b-button @click="finishEdit" variant="success">Salvar</b-button>
				</b-col>
				<b-col class="d-flex justify-content-end">
					<b-button @click="cancelEdit" variant="danger">Cancelar</b-button>
				</b-col>
			</b-row>

		</b-card>

		<div class="mt-3 d-flex justify-content-center align-items-center gap-3">
			<h1>Autores</h1>
			<b-button
				@click="$bvModal.show('new-author')"
				class="btn-sm h-50 pl-3"
				variant="success"
			>
				Criar novo autor
			</b-button>
		</div>

		<b-table
			class="volume-table mt-4"
			v-if="authors"
			:items="authors"
			:fields="fields"
			stacked="md"
			small
		>
			<template #cell(actions)="row">
				<b-button
					size="sm"
					@click="$router.push(`/artigo/${article.id}/autor/${row.item.id}`)"
					class="mr-1"
				>
					Detalhes
				</b-button>
				<b-button
					size="sm"
					@click="confirmDeleteAuthor(row.item)"
					class="mx-2 btn btn-danger"
				>
					Remover
				</b-button>
			</template>
		</b-table>

		<b-modal id="confirm-delete" title="Remover artigo">
			<p v-if="currentAuthor">
				Você tem certeza que deseja remover o autor com o id:
				<b> {{ currentAuthor.id }} </b>, com primeiro nome sendo
				<b>{{ currentAuthor.firstName }}</b>,
				e último nome sendo <b>{{ currentAuthor.lastName }}</b>?
			</p>
			<template #modal-footer="">
				<b-button variant="success" @click="handleDeleteAuthor">
					Remover
				</b-button>
				<b-button variant="danger" @click="cancelDeleteAuthor"
					>Cancelar</b-button
				>
			</template>
		</b-modal>

		<b-modal id="new-author" title="Novo autor">
			<b-row>
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Ordem inválida"
						label="Ordem"
						label-for="author-article-order"
						label-align-sm="right"
					>
						<b-form-input
							id="author-article-order"
							type="number"
							v-on:input="clearError('articleOrder')"
							v-model="form.articleOrder"
							:state="formValidator.articleOrder"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group
						invalid-feedback="email inválido"
						label="Email"
						label-for="author-email"
						label-align-sm="right"
					>
						<b-form-input
							id="author-email"
							type="text"
							v-on:input="clearError('email')"
							v-model="form.email"
							:state="formValidator.email"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Nome inválido"
						label="Primeiro nome"
						label-for="author-first-name"
						label-align-sm="right"
					>
						<b-form-input
							id="author-first-name"
							type="text"
							v-on:input="clearError('firstName')"
							v-model="form.firstName"
							:state="formValidator.firstName"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Nome inválido"
						label="Nome do meio"
						label-for="author-middle-name"
						label-align-sm="right"
					>
						<b-form-input
							id="author-middle-name"
							type="text"
							v-on:input="clearError('middleName')"
							v-model="form.middleName"
							:state="formValidator.middleName"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Sobrenome inválido"
						label="Sobrenome"
						label-for="author-last-name"
						label-align-sm="right"
					>
						<b-form-input
							id="author-last-name"
							type="text"
							v-on:input="clearError('lastName')"
							v-model="form.lastName"
							:state="formValidator.lastName"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>

				<b-col cols="6">
					<b-form-group
						invalid-feedback="Afiliação inválida"
						label="Afiliação"
						label-for="author-affiliation"
						label-align-sm="right"
					>
						<b-form-input
							id="author-affiliation"
							type="text"
							v-on:input="clearError('affiliation')"
							v-model="form.affiliation"
							:state="formValidator.affiliation"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Afiliação inválida"
						label="Afiliação em inglês "
						label-for="author-english-affiliation"
						label-align-sm="right"
					>
						<b-form-input
							id="author-english-affiliation"
							type="text"
							v-on:input="clearError('englishAffiliation')"
							v-model="form.englishAffiliation"
							:state="formValidator.englishAffiliation"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>

				<b-col cols="6">
					<b-form-group
						invalid-feedback="País inválido"
						label="País('BR','PT','US','FR','UK','ES')"
						label-for="author-country"
						label-align-sm="right"
					>
						<b-form-input
							id="author-country"
							type="text"
							v-on:input="clearError('country')"
							v-model="form.country"
							:state="formValidator.country"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="12">
					<b-form-group
						invalid-feedback="ocrID inválido"
						label="ocrID"
						label-for="author-orc-ID"
						label-align-sm="right"
					>
						<b-form-input
							id="author-orc-ID"
							type="number"
							v-on:input="clearError('orcID')"
							v-model="form.orcID"
							:state="formValidator.orcID"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<template #modal-footer="">
				<b-button variant="success" @click="createAuthor">
					Criar
				</b-button>
				<b-button variant="danger" @click="cancelCreateAuthor"
					>Cancelar</b-button
				>
			</template>
		</b-modal>
	</b-overlay>
</template>

<script>
import eventApi from '@/services/eventApi';
import stringMixin from '@/mixins/string';

export default {
	name: 'article-component',
	mixins: [stringMixin],
	data: () => ({
		volumeId: null,
		article: null,
		backupAuthor: null,
		isLoading: false,
		authors: null,
		currentAuthor: null,
    fields: [
      {
        key: "fullName",
        label: "Nome completo",
      },
      {
        key: "articleOrder",
        label: "Ordem",
      },
      { key: "actions", label: "" },
    ],
		changeInput: {
			id: null,
			volumeOrder: null,
			language: null,
			originalTitle: null,
			englishTitle: null,
			originalSummary: null,
			englishSummary: null,
			originalKeywords: null,
			englishKeywords: null,
			numberOfPages: null,
    },
		form: {
			articleOrder: null,
			email: null,
			firstName: null,
			middleName: null,
			lastName: null,
			affiliation: null,
			englishAffiliation: null,
			country: null,
			orcID: null,
    },
		formValidator: {
			articleOrder: undefined,
			email: undefined,
			firstName: undefined,
			middleName: undefined,
			lastName: undefined,
			affiliation: undefined,
			englishAffiliation: undefined,
			country: undefined,
			orcID: undefined,
    },
	}),
	computed: {
    editingArticle() {
      return Object.values(this.changeInput).indexOf(true) > -1;
    },
  },
	methods: {
		resetChangeInput() {
      Object.keys(this.changeInput).forEach((key) => (this.changeInput[key] = false));
    },
		cancelEdit() {
      this.isLoading = true;
      this.resetChangeInput();
      this.volume = { ...this.backupAuthor };
      this.isLoading = false;
    },
		async finishEdit() {
			try {
				this.isLoading = true;
				const { data } = await eventApi.updateArticle({
					volumeId: this.volumeId,
					article: this.article,
				});
				this.article = data;
				this.backupAuthor = { ...this.article };
				this.resetChangeInput()
			} catch (error) {
				console.log(error);
			}
			this.isLoading = false;
		},
		confirmDeleteAuthor(author) {
      this.currentAuthor = author;
      this.$bvModal.show("confirm-delete");
    },
		cancelDeleteAuthor() {
      this.currentAuthor = null;
      this.$bvModal.hide("confirm-delete");
    },
		async handleDeleteAuthor() {
      try {
        this.isLoading = true;
        this.$bvModal.hide("confirm-delete");

        await eventApi.deleteAuthorFromArticle({
					articleId: this.article.id,
					author: this.currentAuthor
				});

				this.authors = this.authors.filter(author => author.id !== this.currentAuthor.id)
        this.currentAuthor = null;
			} catch (error) {
        console.log(error);
        this.$bvModal.show("confirm-delete");
      }
      this.isLoading = false;
    },
		cancelCreateAuthor() {
			this.form = {
				articleOrder: null,
				email: null,
				firstName: null,
				middleName: null,
				lastName: null,
				affiliation: null,
				englishAffiliation: null,
				country: null,
				orcID: null,
			};

			this.formValidator = {
				articleOrder: undefined,
				email: undefined,
				firstName: undefined,
				middleName: undefined,
				lastName: undefined,
				affiliation: undefined,
				englishAffiliation: undefined,
				country: undefined,
				orcID: undefined,
			};

			this.$bvModal.hide('new-author')
		},
		async createAuthor() {
			const isValidForm = this.isValidForm();
			if (!isValidForm) return;

			try {
				this.isLoading = true;
				this.$bvModal.hide('new-author')
				const { data } = await eventApi.createAuthor({
					articleId: this.article.id,
					author: this.form,
				});

				this.authors.push({
					...data,
					fullName: `${data.firstName} ${data.middleName} ${data.lastName}`,
				});
				
				console.log(data);
			} catch (error) {
				this.$bvModal.show('new-author')
				console.log(error);
			}
			this.isLoading = false;
		},
		clearError(field) {
			this.formValidator[field] = undefined;
		},
		isValidForm() {
			const invalidInputs = [];

			Object.keys(this.formValidator).forEach(key => {
				if (!this.form[key]) {
					this.formValidator[key] = false;
					invalidInputs.push(key);
				} else {
					this.formValidator[key] = true;
				}
			});

			return invalidInputs.length === 0;
		},
	},
	async mounted() {
    try {
      this.isLoading = true;

			const { volumeId, articleId } = this.$route.params;

			this.volumeId = volumeId;

			const articleResponse = await eventApi.getArticle({ volumeId, articleId });

			this.article = articleResponse.data
			this.backupAuthor = { ...this.article };

			const authorResponse = await eventApi.getAuthorsFromArticle({ article: this.article })
			this.authors = authorResponse.data.map(el => ({
				...el,
				fullName: `${el.firstName} ${el.middleName} ${el.lastName}`,
			}));
		} catch (error) {
      console.log(error);
    }
		this.isLoading = false;
  },
}
</script>

<style lang="scss" scoped>
	.article-wrapper {
		margin: 24px;
		text-align: left;
	}

	.volume-value {
		font-weight: bold;

		&.edit {
			cursor: pointer;

			&:hover {
				opacity: 0.7;
			}
		}
	}
</style>