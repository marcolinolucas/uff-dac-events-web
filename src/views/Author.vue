<template>
	<b-overlay :show="isLoading" rounded="sm">
		<b-card v-if="author" class="author-wrapper">
			<b-row class="mb-3">
				<b-col>
					<h3>Informações do autor com orcID: {{ author.orcID }}</h3>
				</b-col>
				<b-col class="d-flex justify-content-end">
					<b-button @click="$router.go(-1)" variant="success">Voltar</b-button>
				</b-col>
			</b-row>

			<p>Id: <b>{{ author.id }}</b></p>

			<p>
				Ordem:
				<span class="volume-value edit" @click="() => (changeInput.articleOrder = true)">{{
					author.articleOrder
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.articleOrder"
					v-model="author.articleOrder"
				></b-form-input>
			</p>

			<p>
				Email:
				<span class="volume-value edit" @click="() => (changeInput.email = true)">{{
					author.email
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.email"
					v-model="author.email"
				></b-form-input>
			</p>

			<p>
				Primeiro nome:
				<span class="volume-value edit" @click="() => (changeInput.firstName = true)">{{
					author.firstName
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.firstName"
					v-model="author.firstName"
				></b-form-input>
			</p>

			<p>
				Nome do meio:
				<span class="volume-value edit" @click="() => (changeInput.middleName = true)">{{
					author.middleName
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.middleName"
					v-model="author.middleName"
				></b-form-input>
			</p>

			<p>
				Sobrenome:
				<span class="volume-value edit" @click="() => (changeInput.lastName = true)">{{
					author.lastName
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.lastName"
					v-model="author.lastName"
				></b-form-input>
			</p>

			<p>
				Afiliação:
				<span class="volume-value edit" @click="() => (changeInput.affiliation = true)">{{
					author.affiliation
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.affiliation"
					v-model="author.affiliation"
				></b-form-input>
			</p>

			<p>
				Afiliação em inglês:
				<span class="volume-value edit" @click="() => (changeInput.englishAffiliation = true)">{{
					author.englishAffiliation
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.englishAffiliation"
					v-model="author.englishAffiliation"
				></b-form-input>
			</p>

			<p>
				País:
				<span class="volume-value edit" @click="() => (changeInput.country = true)">{{
					author.country
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.country"
					v-model="author.country"
				></b-form-input>
			</p>

			<p>
				Orc ID:
				<span class="volume-value edit" @click="() => (changeInput.orcID = true)">{{
					author.orcID
				}}</span>
				<b-form-input
					type="text"
					v-if="changeInput.orcID"
					v-model="author.orcID"
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
	</b-overlay>
</template>

<script>
import eventApi from '@/services/eventApi';
import stringMixin from '@/mixins/string';

export default {
	name: 'author-component',
	mixins: [stringMixin],
	data: () => ({
		articleId: null,
		backupAuthor: null,
		isLoading: false,
		author: null,
		changeInput: {
			id: null,
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
      this.author = { ...this.backupAuthor };
      this.isLoading = false;
    },
		async finishEdit() {
			try {
				this.isLoading = true;
				const { data } = await eventApi.updateAuthor({
					articleId: this.articleId,
					author: this.author,
				});
				this.author = data;
				this.backupAuthor = { ...this.author };
				this.resetChangeInput()
			} catch (error) {
				console.log(error);
			}
			this.isLoading = false;
		},
	},
	async mounted() {
    try {
      this.isLoading = true;

			const { articleId, authorId } = this.$route.params;

			this.articleId = articleId;

			const authorResponse = await eventApi.getAuthor({ articleId, authorId });

			this.author = authorResponse.data
			this.backupAuthor = { ...this.author };
		} catch (error) {
      console.log(error);
    }
		this.isLoading = false;
  },
}
</script>

<style lang="scss" scoped>
	.author-wrapper {
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