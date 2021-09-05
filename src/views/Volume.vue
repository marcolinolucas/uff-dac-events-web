<template>
	<b-overlay :show="isLoading" rounded="sm">
		<b-card v-if="volume" class="volume-wrapper">
			<b-row class="mb-3">
				<b-col>
					<h3>Informações do volume {{ volume.initials }}</h3>
				</b-col>
				<b-col class="d-flex justify-content-end">
					<b-button @click="$router.push('/')" variant="success">Voltar</b-button>
				</b-col>
			</b-row>

			<p>Id: <b>{{ volume.id }}</b></p>

			<p>
				Iniciais:
				<span class="volume-value edit" @click="() => (changeInput.initials = true)">{{
					volume.initials
				}}</span>
				<b-form-input
					v-if="changeInput.initials"
					v-model="volume.initials"
				></b-form-input>
			</p>
			
			<p>
				Edição:
				<span class="volume-value edit" @click="() => (changeInput.edition = true)">{{
					volume.edition
				}}</span>
				<b-form-input
					v-if="changeInput.edition"
					v-model="volume.edition"
				></b-form-input>
			</p>

			<p>
				Cidade:
				<span class="volume-value edit" @click="() => (changeInput.city = true)">{{
					volume.city
				}}</span>
				<b-form-input
					v-if="changeInput.city"
					v-model="volume.city"
				></b-form-input>
			</p>

			<p>
				Data de início:
					<span class="volume-value edit" @click="() => (changeInput.startDate = true)">{{
						volume.startDate | dateFilter
					}}</span>
					<b-form-datepicker
						v-if="changeInput.startDate"
						v-model="volume.startDate"
					></b-form-datepicker>
			</p>

			<p>
				Descrição em Português:
				<span class="volume-value edit" @click="() => (changeInput.portugueseDescription = true)">{{
					volume.portugueseDescription
				}}</span>
				<b-form-input
					v-if="changeInput.portugueseDescription"
					v-model="volume.portugueseDescription"
				></b-form-input>
			</p>

			<p>
				Descrição em Inglês:
				<span class="volume-value edit" @click="() => (changeInput.englishDescription = true)">{{
					volume.englishDescription
				}}</span>
				<b-form-input
					v-if="changeInput.englishDescription"
					v-model="volume.englishDescription"
				></b-form-input>
			</p>


			<b-row class="mt-3" v-if="editingVolume">
				<b-col>
					<b-button @click="finishEdit" variant="success">Salvar</b-button>
				</b-col>
				<b-col class="d-flex justify-content-end">
					<b-button @click="cancelEdit" variant="danger">Cancelar</b-button>
				</b-col>
			</b-row>

		</b-card>

		<div class="mt-3 d-flex justify-content-center align-items-center gap-3">
			<h1>Artigos</h1>
			<b-button
				@click="$bvModal.show('new-article')"
				class="btn-sm h-50 pl-3"
				variant="success"
			>
				Criar novo artigo
			</b-button>
		</div>

		<b-table
			class="volume-table mt-4"
			v-if="articles"
			:items="articles"
			:fields="fields"
			stacked="md"
			small
		>
			<template #cell(actions)="row">
				<b-button
					size="sm"
					@click="$router.push(`${volume.id}/artigo/${row.item.id}`)"
					class="mr-1"
				>
					Detalhes
				</b-button>
				<b-button
					size="sm"
					@click="confirmDeleteArticle(row.item)"
					class="mx-2 btn btn-danger"
				>
					Remover
				</b-button>
			</template>
		</b-table>

		<b-modal id="confirm-delete" title="Remover artigo">
			<p v-if="currentArticle">
				Você tem certeza que deseja remover o artigo com o id:
				<b> {{ currentArticle.id }} </b>, Ordem
				<b>{{ currentArticle.volumeOrder }}</b>,
				com <b>{{ currentArticle.numberOfPages }}</b> páginas ?
			</p>
			<template #modal-footer="">
				<b-button variant="success" @click="handleDeleteArticle">
					Remover
				</b-button>
				<b-button variant="danger" @click="cancelDeleteArticle"
					>Cancelar</b-button
				>
			</template>
		</b-modal>

		<b-modal id="new-article" title="Novo artigo">
			<b-row>
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Ordem inválida"
						label="Ordem"
						label-for="article-volume-order"
						label-align-sm="right"
					>
						<b-form-input
							id="article-volume-order"
							type="number"
							v-on:input="clearError('volumeOrder')"
							v-model="form.volumeOrder"
							:state="formValidator.volumeOrder"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Título inválido"
						label="Título original"
						label-for="article-original-title"
						label-align-sm="right"
					>
						<b-form-input
							id="article-original-title"
							type="text"
							v-on:input="clearError('originalTitle')"
							v-model="form.originalTitle"
							:state="formValidator.originalTitle"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Título inválido"
						label="Título em inglês"
						label-for="article-english-title"
						label-align-sm="right"
					>
						<b-form-input
							id="article-english-title"
							type="text"
							v-on:input="clearError('englishTitle')"
							v-model="form.englishTitle"
							:state="formValidator.englishTitle"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Sumário inválido"
						label="Sumário original"
						label-for="article-original-summary"
						label-align-sm="right"
					>
						<b-form-input
							id="article-original-summary"
							type="text"
							v-on:input="clearError('originalSummary')"
							v-model="form.originalSummary"
							:state="formValidator.originalSummary"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Sumário inválido"
						label="Sumário em inglês"
						label-for="article-english-summary"
						label-align-sm="right"
					>
						<b-form-input
							id="article-english-summary"
							type="text"
							v-on:input="clearError('englishSummary')"
							v-model="form.englishSummary"
							:state="formValidator.englishSummary"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>

				<b-col cols="6">
					<b-form-group
						invalid-feedback="Linguagem inválida"
						label="Linguagem ('pt', 'en', 'es')"
						label-for="article-language"
						label-align-sm="right"
					>
						<b-form-input
							id="article-language"
							type="text"
							v-on:input="clearError('language')"
							v-model="form.language"
							:state="formValidator.language"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="6">
					<b-form-group
						invalid-feedback="Palavras-chave inválidas"
						label="Palavras-chave originais (exemplo1,exemplo2)"
						label-for="article-original-keywords"
						label-align-sm="right"
					>
						<b-form-input
							id="article-original-keywords"
							type="text"
							v-on:input="clearError('originalKeywords')"
							v-model="form.originalKeywords"
							:state="formValidator.originalKeywords"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>

				<b-col cols="6">
					<b-form-group
						invalid-feedback="Palavras-chave inválidas"
						label="Palavras-chave em inglês (example1,example2)"
						label-for="article-english-keywords"
						label-align-sm="right"
					>
						<b-form-input
							id="article-english-keywords"
							type="text"
							v-on:input="clearError('englishKeywords')"
							v-model="form.englishKeywords"
							:state="formValidator.englishKeywords"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row class="my-2">
				<b-col cols="12">
					<b-form-group
						invalid-feedback="Número de páginas inválidas"
						label="Número de páginas"
						label-for="article-number-of-pages"
						label-align-sm="right"
					>
						<b-form-input
							id="article-number-of-pages"
							type="number"
							v-on:input="clearError('numberOfPages')"
							v-model="form.numberOfPages"
							:state="formValidator.numberOfPages"
							trim
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<template #modal-footer="">
				<b-button variant="success" @click="createArticle">
					Criar
				</b-button>
				<b-button variant="danger" @click="cancelCreateArticle"
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
	name: 'volume-component',
	mixins: [stringMixin],
	data: () => ({
		volume: null,
		backupVolume: null,
		articles: null,
		isLoading: false,
		currentArticle: null,
    fields: [
      {
        key: "originalTitle",
        label: "Título Original",
      },
      {
        key: "volumeOrder",
        label: "Ordem",
      },
      { key: "actions", label: "" },
    ],
		changeInput: {
      initials: false,
      edition: false,
      city: false,
      startDate: false,
      portugueseDescription: false,
      englishDescription: false,
    },
		form: {
			volumeOrder: null,
			originalTitle: null,
			englishTitle: null,
			originalSummary: null,
			englishSummary: null,
			language: null,
			originalKeywords: null,
			englishKeywords: null,
			numberOfPages: null,
    },
		formValidator: {
			volumeOrder: undefined,
			originalTitle: undefined,
			englishTitle: undefined,
			originalSummary: undefined,
			englishSummary: undefined,
			language: undefined,
			originalKeywords: undefined,
			englishKeywords: undefined,
			numberOfPages: undefined,
    },
	}),
	computed: {
    editingVolume() {
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
      this.volume = { ...this.backupVolume };
      this.isLoading = false;
    },
		async finishEdit() {
			try {
				this.isLoading = true;
				const { data } = await eventApi.updateVolume({ volume: this.volume });
				this.volume = data;
				this.backupVolume = { ...this.volume };
				this.resetChangeInput()
			} catch (error) {
				console.log(error);
			}
			this.isLoading = false;
		},
		confirmDeleteArticle(article) {
      this.currentArticle = article;
      this.$bvModal.show("confirm-delete");
    },
		cancelDeleteArticle() {
      this.currentArticle = null;
      this.$bvModal.hide("confirm-delete");
    },
		async handleDeleteArticle() {
      try {
        this.isLoading = true;
        this.$bvModal.hide("confirm-delete");
        await eventApi.deleteArticleFromVolume({
					volumeId: this.volume.id,
					article: this.currentArticle
				});
				this.articles = this.articles.filter(article => article.id !== this.currentArticle.id)
        this.currentArticle = null;
			} catch (error) {
        console.log(error);
        this.$bvModal.show("confirm-delete");
      }
      this.isLoading = false;
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
		async createArticle() {
			const isValidForm = this.isValidForm();
			if (!isValidForm) return;

			try {
				this.isLoading = true;
				this.$bvModal.hide('new-article')
				const { data } = await eventApi.createArticle({
					volumeId: this.volume.id,
					article: this.form,
				});
				this.articles.push(data);
				
				console.log(data);
			} catch (error) {
				this.$bvModal.show('new-article')
				console.log(error);
			}
			this.isLoading = false;
		},
		clearError(field) {
			this.formValidator[field] = undefined;
		},

		cancelCreateArticle() {
			this.form = {
				volumeOrder: null,
				originalTitle: null,
				englishTitle: null,
				originalSummary: null,
				englishSummary: null,
				language: null,
				originalKeywords: null,
				englishKeywords: null,
				numberOfPages: null,
			};

			this.formValidator = {
				volumeOrder: undefined,
				originalTitle: undefined,
				englishTitle: undefined,
				originalSummary: undefined,
				englishSummary: undefined,
				language: undefined,
				originalKeywords: undefined,
				englishKeywords: undefined,
				numberOfPages: undefined,
			};

			this.$bvModal.hide('new-article')
		}
	},
	async mounted() {
    try {
      this.isLoading = true;

			const { volumeId } = this.$route.params;

			const volumeResponse = await eventApi.getVolume({ volumeId });
			this.volume = volumeResponse.data;
			this.backupVolume = { ...this.volume };

			const articleResponse = await eventApi.getArticlesFromVolume({ volumeId });
			this.articles = articleResponse.data;
		} catch (error) {
      console.log(error);
    }
		this.isLoading = false;
  },
}
</script>

<style lang="scss" scoped>
	.volume-wrapper {
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